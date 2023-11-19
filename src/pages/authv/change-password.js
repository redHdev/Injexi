import React, { useState, useEffect } from 'react';
import HeadMeta from '@/components/HeadMeta';
import { Form, Input, Button, notification } from 'antd';
import { useRouter } from 'next/router';


function ResetPasswordForm() {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true); // New state variable

  const router = useRouter();

  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token);

      // Verifying the token
      fetch(`/api/verifyPasswordToken?token=${router.query.token}`)
        .then((response) => response.json())
        .then((data) => {
          setIsCheckingToken(false); // Update the state to indicate checking is complete

          if (data.success && !data.used) {
            setTokenIsValid(true);
            
          } else {
            setTokenIsValid(false);
            
            api.error({
              message: 'Invalid Token',
              description: 'The token provided is invalid or has expired.',
            });
          }
        })
        .catch((error) => {
          setIsCheckingToken(false); // Update the state to indicate checking is complete
          api.error({
            message: 'Error',
            description: 'An error occurred while verifying the token.',
          });
        });
    }
  }, [router.query, api]);

  const onFinish = async (values) => {
    setLoading(true);
  
    try {
      // Make an API call to reset the password
      const response = await fetch('/api/resetPassword/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token, // Token received from the router query
          newPassword: values.newPassword, // New password from the form
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        api.success({
          message: 'Password Reset Successful',
          description: 'You have successfully reset your password.',
        });

        // Add a delay before redirecting to login
      setTimeout(() => {
        router.replace('/login');
      }, 2000); // 2000 milliseconds = 2 seconds
    } else {
      api.error({
        message: 'Password Reset Failed',
        description: data.message || 'An error occurred while resetting the password.',
      });
    }
  } catch (error) {
    api.error({
      message: 'Error',
      description: 'An error occurred while resetting the password.',
    });
  }

  setLoading(false);
};

  return (
    <div>
      {contextHolder}
      <HeadMeta page="changePassword" />
      <div className="custom-container">
      {isCheckingToken ? (
          <h1>Checking Token...</h1> // Show this while checking
        ) : tokenIsValid ? (
          <>
        <h1>Create New Password</h1>
        <Form
          className="custom-form"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
                className="form-item-white"
                label={<span style={{ color: '#ffff', fontSize: '18px' }}>New Password:</span>}
                name="newPassword"
                rules={[{ required: true, message: 'This field is required' }]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item
                className="form-item-white"
                label={<span style={{ color: '#ffff', fontSize: '18px' }}>Confirm New Password:</span>}
                name="confirmNewPassword"
                rules={[
                  { required: true, message: 'This field is required' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('The passwords that you entered do not match!')
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
              loading={loading}
              style={{ backgroundColor: '#F64CB7', borderColor: '#252525' }}
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
        </>
        ) : (
          <h1>The token provided is invalid or has expired.</h1>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordForm;