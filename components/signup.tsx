import Head from 'next/head';
import { useState } from 'react';
import styles from './signup.module.css'; 
import { useNewConvoMutation, useUpdateUserMutation } from '@/redux/services/appApi';
import products from './products';


type SignupProps = {
  onClose: () => void; 
  character?: string 
};

const Signup = ({ onClose , character }: SignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [newConvo ] = useNewConvoMutation();
  const [showModal, setShowModal] = useState(true);
  const [updateUser, { isError, isLoading }] = useUpdateUserMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });     
                               
      if (res.ok) {
       await res.json();
       await updateUser(JSON.stringify({ email, password }))
       onClose()
       if (character) {
       const char = products.find((prod:any) => prod.id == character)
       await newConvo({ provider: char })
       window.location.reload();
       }
    
    
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred during registration');
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onClose()
  };

  if (!showModal) return null;

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <button className={styles.closeButton} onClick={handleCloseModal}>X</button>
          <div className={styles.modalContent}>
            <img
              src="https://res.cloudinary.com/dgyn6qakv/image/upload/v1724288444/00361-439040220_uxb9cm.png"
              alt="Signup Image"
              className={styles.image}
            />
            <form onSubmit={handleSubmit} className={styles.form}>
              <h1 className={styles.title}>Sign Up</h1>
              {error && <p className={styles.error}>{error}</p>}
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <button type="submit" className={styles.button}>Sign Up</button>
            </form>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Signup;
