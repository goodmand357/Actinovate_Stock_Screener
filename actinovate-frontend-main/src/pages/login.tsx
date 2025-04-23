import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) console.error(error);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button onClick={signIn} className="bg-blue-600 text-white p-4 rounded">
        Sign in with GitHub
      </button>
    </div>
  );
}
