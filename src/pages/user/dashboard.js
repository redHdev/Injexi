import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { EditOutlined, EllipsisOutlined, SettingOutlined, HomeOutlined, UserOutlined, ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { Avatar, Card, Breadcrumb, Col, Row, Statistic, Typography, Button, Timeline, Alert, Progress, Tabs } from 'antd';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';


const { Meta } = Card;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

function Dashboard({ data }) {
  const [userData, setUserData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(null);
  const { data: session } = useSession();
  const [hideCompletedProfileAlert, setHideCompletedProfileAlert] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);  

  const Router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = session?.user?.email;
        if (!email) {
          console.warn("Email not available in session.");
          return;
        }

        // Log the email to the console
      console.log("Session Email:", email);

      const res = await fetch(`/api/getUserDetails/?email=${email}`, {
        headers: {
          "Session-Email": email
        }
      });

        if (res.ok) {
          const data = await res.json();
          console.log("User Data: ", data.user);
          setUserData(data.user);
          setProfileCompletion(data?.user?.profileCompletion);
          setNewsletterSubscribed(data?.user?.newsletterSubscribed || false);
          // Update form fields or other state here if needed
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
      }
    };

    fetchUserData();
  }, [session]);


  // Check if the user has closed the "Profile completed" alert before
  useEffect(() => {
    const closedAlert = localStorage.getItem('completedProfileAlertClosed');
    if (closedAlert === "true") {
      setHideCompletedProfileAlert(true);
    }
  }, []);

  const handleCloseCompletedProfileAlert = () => {
    localStorage.setItem('completedProfileAlertClosed', "true");
    setHideCompletedProfileAlert(true);
  };

  return (
    <>
      <Head>
        <title>User Dashboard | Injexi.com</title>
      </Head>

      <Breadcrumb style={{ marginBottom: '20px', marginTop: '20px' }}>
        <Breadcrumb.Item>
          <Link href="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/user/dashboard/">
            Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/user/settings/">
            Settings
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>

    {/* Alerts */}
    <Col span={24}>
  <Title level={4}>Notifications</Title>

  {profileCompletion !== 100 && (
    <Alert 
      message={
        <>
          <span> IMPORTANT: </span>
          <span onClick={() => Router.push('/user/settings/')} style={{ color: 'black', cursor: 'pointer', textDecoration: 'underline' }}>
            Complete your profile
          </span>
          <span> for a better Injexi experience</span>
        </>
      }
      type="warning" 
      showIcon 
      style={{ marginTop: '15px', marginBottom: '15px' }} 
    />
  )}

  {!newsletterSubscribed && (
    <Alert
      message={
        <>
          <span onClick={() => Router.push('/user/settings/')} style={{ color: 'black', cursor: 'pointer', textDecoration: 'underline' }}>
            Enable
          </span>
          <span> email notifications for special offers</span>
        </>
      }
      type="warning"
      showIcon
      style={{ marginTop: '15px', marginBottom: '15px' }}
    />
  )}

  {profileCompletion === 100 && newsletterSubscribed && !hideCompletedProfileAlert && (
    <Alert 
      message="You've successfully completed your profile!" 
      type="success" 
      showIcon 
      closable 
      onClose={handleCloseCompletedProfileAlert}
      style={{ marginTop: '15px', marginBottom: '15px' }} 
    />
  )}

  {profileCompletion === 100 && newsletterSubscribed && hideCompletedProfileAlert && (
    <Alert 
      message="No new notifications." 
      type="success" 
      showIcon 
      style={{ marginTop: '15px', marginBottom: '15px' }} 
    />
  )}
</Col>




       



        

      <Row gutter={[16, 16]}>
        <Col span={24}>
        <Title level={2}>{`Welcome to your Injexi Dashboard`}</Title><br></br>
          <Text>Hi {userData?.firstName}, This is your one-stop shop for managing your account and accessing site features.</Text>
        </Col>

        

        <Col xs={24} sm={12} md={8}>
  <Card
    
    actions={[
      <Link href="/user/settings/" passHref>
  <Button type="link" style={{ color: '#ffffff', backgroundColor: '#F64CB7' }}>Update Information</Button>
</Link>
    ]}
  >
    <Meta title="Your Information" description="Configure your account settings and manage your personal information." />
  </Card>
</Col>


        <Col xs={24} sm={12} md={8}>
          <Card
            
            actions={[
              <Link href="/user/reviews/" passHref>
              <Button type="link" style={{ color: '#ffffff', backgroundColor: '#F64CB7' }}>View Reviews</Button>
              </Link>
            ]}
          >
            <Meta title="Your Reviews" description="View and update reviews you've left for businesses you've had treatment from." />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            
            actions={[
              <Button type="link">Coming Soon</Button>
            ]}
          >
            <Meta title="Saved List" description="View all of the items in your saved list such as interesting businesses or information." />
          </Card>
        </Col>

        
      </Row>

            
    </>
  );
}

export default Dashboard;