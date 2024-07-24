import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Label, TextInput, Button, Card } from 'flowbite-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Rediriger vers la page d'accueil
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-xs ">
        <form className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email1" value="Mail Junia (administrateur)" />
            </div>
            <TextInput id="email1" type="email" placeholder="prenom.nom@...junia.com" required 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password1" value="Mot de passe" />
            </div>
            <TextInput id="password1" type="password" required 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <Button type="submit" onClick={handleLogin}>Se connecter</Button>
          <div className="flex items-center gap-2">
            <Label htmlFor="agree" className="flex">
              Si vous ne possédez pas de compte, veuillez contacter milo.montuori@student.junia.com
            </Label>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
