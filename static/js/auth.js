const SUPABASE_URL = 'https://ngrblqyvchdvqnwpjdpv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncmJscXl2Y2hkdnFud3BqZHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4ODM2MjQsImV4cCI6MjA3OTQ1OTYyNH0.rXdMuF0kB13Y9w6dIJD4ebZ7fgDOLUaPAPjCIq_MfEs';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authError = document.getElementById('auth-error');
    const logoutBtn = document.getElementById('logout-btn');
    const loginLink = document.getElementById('login-link');

    const { data: { session } } = await supabase.auth.getSession();

    const publicPages = ['/login', '/signup'];
    const isPublicPage = publicPages.includes(window.location.pathname);

    if (!session && !isPublicPage) {
        window.location.href = '/signup';
        return;
    }

    if (session && isPublicPage) {
        window.location.href = '/';
        return;
    }

    if (logoutBtn) {
        logoutBtn.classList.remove('hidden');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            authError.classList.add('hidden');

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                authError.textContent = error.message;
                authError.classList.remove('hidden');
            } else {
                window.location.href = '/';
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            authError.classList.add('hidden');

            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) {
                authError.textContent = error.message;
                authError.classList.remove('hidden');
            } else {
                alert('Signup successful! Please check your email to verify your account.');
                window.location.href = '/login';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = '/login';
        });
    }
});
