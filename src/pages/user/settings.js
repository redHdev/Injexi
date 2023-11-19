import Head from 'next/head';
import { HomeOutlined, ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined, } from '@ant-design/icons';
import { Col, Row, Card, Avatar, Progress, Breadcrumb, Form, Input, Button, Checkbox, Typography, notification, Tooltip, Select, } from 'antd';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const { Title } = Typography;

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

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toDateString();
}

function Settings() {
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession();

  
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);
  const [loadingUpdateLocation, setLoadingUpdateLocation] = useState(false);
  

  const [userData, setUserData] = useState(null);
  const [form] = Form.useForm();


  ////

  const isPhoneVerified = userData?.isPhoneVerified;
  const isVerified = userData?.isVerified;

  // Define fetchUserData outside of useEffect to make it reusable
  const fetchUserData = async () => {
    try {
      const email = session?.user?.email;
      if (!email) {
        console.warn('Email not available in session.');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getUserDetails/?email=${email}`, {
        method: 'GET',
        headers: {
          "Session-Email": email
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        setUserData(data.user);
        form.setFieldsValue({
          suburb: data?.user?.suburb,
          postcode: data?.user?.postcode,
          country: data?.user?.country,
          email: data?.user?.email,
          firstName: data?.user?.firstName,
          lastName: data?.user?.lastName,
          phoneNumber: data?.user?.phoneNumber,
          isVerified: data?.user?.isVerified,
          newsletterSubscribed: data?.user?.newsletterSubscribed ?? false,
          profileCompletion: data?.user?.profileCompletion,
        });
      }
    } catch (error) {
      console.error('An error occurred while fetching user data:', error);
    }
  };

  // useEffect to call fetchUserData
  useEffect(() => {
    fetchUserData();
  }, [session]);

  /////


  // Update or Change User Password
  const onFinishChangePassword = async (values) => {
    setLoadingChangePassword(true);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/changePassword/`,
            {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, email: session?.user?.email }),
            }
        );
        debugger;
        if (res.ok && res.status === 200) {
            api.success({
                message: "Success",
                description: "Successfully updated",
            });
        }
        else if (res.status === 404) {
            api.warning({
                message: "Not Found",
                description: "User not found",
            });
        }
        else if (res.status === 401) {
            api.warning({
                message: "Bad request",
                description: "Incorrect old password",
            });
        }
        else {
            api.error({
                message: "Error",
                description: "Failed to change password",
            });
        }

        setLoadingChangePassword(false);
    
  };


  // Update User Location Details
  const onFinishUpdateLocation = async (values) => {
    setLoadingUpdateLocation(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/updateUserLocation/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          phoneNumber: values.phoneNumber,
          firstName: values.firstName,
          lastName: values.lastName,
          suburb: values.suburb,
          postcode: values.postcode,
          country: values.country,
          newsletterSubscribed: values.newsletterSubscribed,
        }),
      });

      if (res.ok && res.status === 200) {
        api.success({
          message: 'Success',
          description: 'Successfully updated details',
        });
        // Re-fetch userData to update the details
        fetchUserData();
      } else {
        api.error({
          message: 'Error',
          description: 'Failed to update details',
        });
      }
    } catch (error) {
      api.error({
        message: 'Exception',
        description: `An exception occurred: ${error.message}`,
      });
    }

    setLoadingUpdateLocation(false);
  };

  return (
    <>
      <Head>
        <title>User Settings | Injexi</title>
      </Head>
      {contextHolder}
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


      {userData?.profileCompletion !== 100 && (
  <Col span={24}>
    <Title level={4}>
      <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
      Profile Completion
    </Title>
    <Progress
      percent={userData?.profileCompletion || 0}
      status="active"
      style={{ marginBottom: '20px' }}
    />
  </Col>
)}



      <Row gutter={[20, 50]} justify="center">

        {/* User Location Details Form */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="User Details" bordered={false}>
          <Row justify="center" align="middle" style={{ marginBottom: '16px' }}>
      <Avatar
        size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 64, xxl: 100 }}
        style={{ backgroundColor: '#F64CB7' }}
      >
        {session?.user?.name?.charAt(0)}
      </Avatar>
    </Row>
          <Form
      layout="vertical"
      onFinish={onFinishUpdateLocation}
      form={form}
    >
      

      <Form.Item 
      label="First Name"
      name="firstName"
       
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item 
      label="Last Name"
      name="lastName"
       
      >
        <Input size="large" />
      </Form.Item>
      
      <Form.Item label=
      {isVerified
        ? <>Email<CheckCircleOutlined style={{ color: '#F64CB7', marginLeft: '3px' }} /></>
        : "Email"
      }
      name="email"
      >
        {isVerified ? (
          <Tooltip title="Email verified" mouseEnterDelay={0.1}>
          <Input
            size="large"
            value={userData?.email}
            readOnly
            disabled
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </Tooltip>
        ) : (
          <Input 
            size="large" 
            value={userData?.email}
            readOnly={true} 
            disabled={true}
          />
        )}
      </Form.Item>
      
      
      
<Form.Item 
        label={
          isPhoneVerified 
            ? <>Phone <CheckCircleOutlined style={{ color: '#F64CB7', marginLeft: '3px' }} /></> 
            : "Phone"
        }
        name="phoneNumber"
      >
        {isPhoneVerified ? (
          <Tooltip title="Phone number verified" mouseEnterDelay={0.1}>
            <Input 
              size="large"
              value={userData?.phoneNumber}
              placeholder="For SMS verification only" 
              readOnly={true} 
              disabled={true} 
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </Tooltip>
        ) : (
          <div style={{ marginBottom: '0px' }}>
  
  <Tooltip title="Phone number is added automatically">
    <Input
      size="large"
      value={userData?.phoneNumber}
      placeholder="For SMS verification only"
      readOnly={false}
      disabled={true}
    />
  </Tooltip>
  <small style={{ display: 'block', marginTop: '4px', color: '#666' }}>
    Phone number is added automatically when you leave a review for a business on Injexi.
  </small>
</div>
          
        )}
      </Form.Item>


      <Form.Item
        label="Suburb"
        name="suburb"
        
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        label="Postcode"
        name="postcode"
        
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
  label="Country"
  name="country"
>
  <Select
    size="large"
    placeholder="Select your country" // Placeholder text to display when no value is selected
  >
    <Select.Option value="Australia">Australia</Select.Option>
    <Select.Option value="USA">USA</Select.Option>
    <Select.Option value="UK">UK</Select.Option>
    <Select.Option value="Other">Other</Select.Option>
  </Select>
</Form.Item>

      <Form.Item name="newsletterSubscribed" label="Email Communication" valuePropName="checked">
  <Checkbox />
</Form.Item>

      <Form.Item>
      <Button
  block
  type="primary"
  htmlType="submit"
  size="large"
  style={{ backgroundColor: '#F64CB7', borderColor: '#F64CB7' }} 
  icon={<SyncOutlined />} 
  loading={loadingUpdateLocation}
>
  Update Details
</Button>
      </Form.Item>
    </Form>
          </Card>
        </Col>

        {/* Change Password Form */}
        <Col xs={24} sm={24} md={12} lg={12}>
          <Card title="Change Password" bordered={false}>
            <Form
              autoComplete="off"
              layout="vertical"
              onFinish={onFinishChangePassword}
            >
              <Form.Item
                                label="Old Password"
                                name="oldPassword"
                                rules={[{ required: true, message: "This field is required" }]}
                            >
                                <Input.Password size="large" />
                            </Form.Item>

                            <Form.Item
  label="New Password"
  name="newPassword"
  rules={[
    { required: true, message: "This field is required" },
    { min: 8, message: "Password must be at least 8 characters long" }
  ]}
>
  <Input.Password size="large" />
</Form.Item>

<Form.Item
  label="Confirm New Password"
  name="confirmPassword"
  rules={[
    {
      required: true,
      message: "This field is required",
    },
    {
      min: 8,
      message: "Password must be at least 8 characters long",
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue("newPassword") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error("The new password that you entered do not match!")
        );
      },
    }),
  ]}
>
  <Input.Password size="large" />
</Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{ backgroundColor: '#F64CB7', borderColor: '#F64CB7' }} 
                  icon={<SyncOutlined />} 
                  loading={loadingChangePassword}
                >
                  Update Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Settings;
