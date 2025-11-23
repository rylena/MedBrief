const { createClient } = supabase;

let supabaseClient;

async function initSupabase() {
    const response = await fetch('/api/config');
    const config = await response.json();
    supabaseClient = createClient(config.supabaseUrl, config.supabaseKey);
    return supabaseClient;
}

document.addEventListener('DOMContentLoaded', async () => {
    await initSupabase();

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
