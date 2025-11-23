const { createClient } = supabase;

const SUPABASE_URL = 'https://ngrblqyvchdvqnwpjdpv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncmJscXl2Y2hkdnFud3BqZHB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4ODM2MjQsImV4cCI6MjA3OTQ1OTYyNH0.rXdMuF0kB13Y9w6dIJD4ebZ7fgDOLUaPAPjCIq_MfEs';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const authError = document.getElementById('auth-error');
    const loginLink = document.getElementById('login-link'); // Keep this if not explicitly removed

    const { data: { session } } = await supabaseClient.auth.getSession();

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

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        if (session) {
            logoutBtn.classList.remove('hidden');
        }

        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseClient.auth.signOut();
            window.location.href = '/login';
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            authError.classList.add('hidden');

            const { data, error } = await supabaseClient.auth.signInWithPassword({
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

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const errorDiv = document.getElementById('auth-error');

            authError.classList.add('hidden');

            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
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
