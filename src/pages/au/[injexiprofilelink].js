// src/pages/au/[injexiprofilelink].js
import Profile from '/src/components/profiletemplate.js';

export async function getStaticProps(context) {
  const profileLink = context.params.injexiprofilelink;
  let data = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getBusiness/?profileLink=${profileLink}`);
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText);
    }
    data = await res.json();
    console.log("API Response:", data);
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: data.data,
    },
  };
}

export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getData/`);
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText);
    }
    const data = await res.json();

    const paths = data.data
      .filter(business => business.businessDetails && typeof business.businessDetails['Injexi Profile Link'] === 'string')
      .map((business) => ({
        params: { injexiprofilelink: business.businessDetails['Injexi Profile Link'] },
      }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching profile links:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

function BusinessProfile({ data }) {
  const profileLink = data?.businessDetails['Injexi Profile Link'];
  const pageType = profileLink ? profileLink.replace(/[^a-zA-Z0-9]/g, '') : 'defaultProfile'; // This sanitizes the profileLink to a format usable in metaConfig

  return <Profile data={data} pageType={pageType} />;
}


export default BusinessProfile;
