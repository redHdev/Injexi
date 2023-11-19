import React, { useState } from 'react';
import HeadMeta from '@/components/HeadMeta';
import { Form, Input, Button, notification } from 'antd';
import Link from 'next/link';

function ResetPassword() {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Create a form instance to control the email input field

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const responseGenerateToken = await fetch('/api/generateResetToken/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });
      
      if (responseGenerateToken.ok) {
        await responseGenerateToken.json();
        
        api.success({
          message: 'Reset Link Sent',
          description: 'A password reset link has been sent to your email.',
        });

        // Clear the email input field on success
        form.setFieldsValue({ email: '' });
      } else {
        api.error({
          message: 'Email Not Sent',
          description: 'Invalid email or email not found.',
        });
      }
    } catch (error) {
      api.error({
        message: 'An Error Occurred',
        description: error.message,
      });
    }
    
    setLoading(false);
  };

  return (
    <div>
      {contextHolder}
      <HeadMeta page="resetPassword" />
      <div className="custom-container">
        <h1>Reset Password</h1>
        <Form
          form={form} // Connect the form instance to the form component
          className="custom-form"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            className="form-item-white"
            label={
              <span style={{ color: '#ffff', fontSize: '18px' }}>Email:</span>
            }
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'This field is required',
              },
            ]}
          >
            <Input size="large" />
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
              Send Reset Link
            </Button>
          </Form.Item>

          <p>
            Remembered your password?{' '}
            <Link href="/login">Login to The Injexi Club</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;
