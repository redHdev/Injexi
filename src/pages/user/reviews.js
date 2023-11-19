import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { HomeOutlined, ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Avatar, Card, Breadcrumb, Col, Row, Typography, Button } from 'antd';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';

const { Meta } = Card;
const { Title, Text } = Typography;

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

function Reviews() {
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const { data: session } = useSession();
  const Router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = session?.user?.email;
      if (!email) {
        console.warn("Email not available in session.");
        return;
      }

      const res = await fetch(`/api/getUserDetails/?email=${email}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
      }
    };

    const fetchUserReviews = async () => {
      const email = session?.user?.email;
      if (!email) {
        console.warn("Email not available in session.");
        return;
      }

      const res = await fetch(`/api/getReviewsByEmailAddress/?email=${email}`);
      if (res.ok) {
        const data = await res.json();
        setUserReviews(data.data);
      }
    };

    fetchUserData();
    fetchUserReviews();
  }, [session]);

  return (
    <>
      <Head>
        <title>User Reviews | Injexi.com</title>
      </Head>

      <Breadcrumb style={{ marginBottom: '20px', marginTop: '20px' }}>
        <Breadcrumb.Item>
          <Link href="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/user/dashboard/">Dashboard</Link>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={2}>Welcome to your Reviews Page</Title><br />
          <Text>Hi {userData?.firstName}, you can manage your reviews here.</Text>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            actions={[
              <Button type="link" style={{ color: '#ffffff', backgroundColor: '#F64CB7' }}>Write Review</Button>
            ]}
          >
            <Meta title="Write a Review" description="Share your thoughts about the treatments you've received." />
          </Card>
        </Col>

        <Col xs={24} sm={24} md={24}>
  <Title level={4} style={{ color: 'black' }}>Your Reviews</Title>
  <Row gutter={[16, 16]}>
    {userReviews.map((review, index) => (
      <Col key={index} xs={24} sm={12} md={8}>
        <Card
          hoverable
          style={{ marginBottom: '20px' }}
          title={<Title level={5} style={{ color: 'black' }}>{review.businessName}</Title>}
          extra={
            <span style={{ color: 'black' }}>
              {Array.from({ length: review.starRating }, (_, i) => (
                <i key={i} className="fas fa-star" style={{ color: '#fcb900' }}></i>
              ))}
            </span>
          }
          actions={[
            <>
              {review.approved ? (
                <div style={{ color: 'green', marginBottom: '10px' }}>
                  <CheckCircleOutlined style={{ marginRight: '5px' }} /> Approved
                </div>
              ) : (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                  <CloseCircleOutlined style={{ marginRight: '5px' }} /> Not Yet Approved
                </div>
              )}
              <div style={{ borderTop: '1px solid #e8e8e8', width: '100%', height: '1px', margin: '10px 0' }}></div>
              <Button type="link" style={{ color: '#ffffff', backgroundColor: '#F64CB7', marginTop: '15px' }}>Update Review</Button>
              <a style={{ alignSelf: 'center', color: '#999999', marginTop: '20px' }}>Delete Review</a>
            </>
          ]}
        >
          <p style={{ color: 'black' }}><strong>Written On:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
          <p style={{ color: 'black' }}><strong>Display Name:</strong> {review.customerName}</p>
          
          <p style={{ color: 'black' }}><strong>Review Title:</strong> {review.reviewTitle}</p>
          <p style={{ color: 'black' }}><strong>Review:</strong> {review.review}</p>
          <p style={{ color: 'black' }}><strong>Review Reply:</strong> {review.reviewReply}</p>
        </Card>
      </Col>
    ))}
  </Row>
</Col>







      </Row>
    </>
  );
}

export default Reviews;
