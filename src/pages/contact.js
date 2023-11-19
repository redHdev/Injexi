import { useState, useEffect } from 'react';
import HeadMeta from '/src/components/HeadMeta.js';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: '',
    location: '',
    message: '',
    referrer: '', // Adding a new field to store the referrer URL
    pageURL: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Capture the referrer URL when the component mounts
    setFormData(prevState => ({ 
      ...prevState, 
      referrer: document.referrer || 'Direct Entry', // Set the referrer URL when the component mounts 
      pageURL: window.location.href, //Set the page URL of the form submission
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/sendContactFormEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // formData now includes the referrer field
      });

      if (response.ok) {
        setSuccessMessage('Email sent successfully');
        setFormData({
          name: '',
          email: '',
          topic: '',
          location: '',
          message: '',
          referrer: '', // Reset the referrer field as well
        });
      } else {
        setErrorMessage('Error sending email');
      }
    } catch (error) {
      console.error('Error sending email', error);
      setErrorMessage('Error sending email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <HeadMeta page="contact" />

      <div className="container">
        <h1>Contact Us</h1>
        

        <p>Submit the form below, and we'll get back to you as soon as we can 🚀</p>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name: <span style={{ color: 'red' }}>*</span></label>
          <input type="text" id="name" name="name" value={formData.name} required onChange={handleChange} />

          <label htmlFor="email">Email: <span style={{ color: 'red' }}>*</span></label>
          <input type="email" id="email" name="email" value={formData.email} required onChange={handleChange} />

          <label htmlFor="topic">Topic:</label>
          <select id="topic" name="topic" value={formData.topic} onChange={handleChange}>
            <option value="" disabled>-</option>
            <option value="Business Inquiry">Business Inquiry</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>

          <label htmlFor="location">Location:</label>
          <select id="location" name="location" value={formData.location} onChange={handleChange}>
            <option value="" disabled>-</option>
            <option value="Australia">Australia</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="message">Message: <span style={{ color: 'red' }}>*</span></label><br />
          <textarea id="message" name="message" rows="4" value={formData.message} required onChange={handleChange}></textarea><br /><br />

          <input type="submit" value={isLoading ? 'Sending...' : 'Send Message'} disabled={isLoading} />
        </form>
      </div>
    </div>
  );
}

export default Contact;
