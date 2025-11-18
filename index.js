document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('login-link');
    const userProfileDiv = document.getElementById('user-profile');
    const toPanelLink = document.getElementById('to-panel-link'); // Link "To Panel"
    const getStartedLink = document.getElementById('get-started-link'); // Link "Get Started"
    
    // Cek status login dari Local Storage.
    // Status ini disetel di halaman loginpage.html setelah berhasil login.
    const statusLogin = localStorage.getItem('isLoggedIn');

    function updateHeaderStatus() {
        if (statusLogin === 'true') {
            // Jika statusnya true (Pengguna telah login)
            if (loginLink) {
                loginLink.style.display = 'none'; // Sembunyikan tombol 'Login'
            }
            if (userProfileDiv) {
                // Gunakan 'flex' atau 'block' sesuai display aslinya di CSS
                userProfileDiv.style.display = 'flex'; // Tampilkan 'Profile Pengguna'
            }
        } else {
            // Jika statusnya false atau belum ada
            if (loginLink) {
                loginLink.style.display = 'block'; // Tampilkan tombol 'Login'
            }
            if (userProfileDiv) {
                userProfileDiv.style.display = 'none'; // Sembunyikan 'Profile Pengguna'
            }
        }
    }

    // Fungsi baru untuk mengupdate tombol "To Panel" dan "Get Started"
    function updateButtonAccess() {
        if (statusLogin === 'true') {
            // Jika sudah login, tampilkan tombol
            if (toPanelLink) {
                toPanelLink.style.display = 'inline-block';
            }
            if (getStartedLink) {
                getStartedLink.style.display = 'inline-block';
            }
        } else {
            // Jika belum login, sembunyikan tombol
            if (toPanelLink) {
                toPanelLink.style.display = 'none';
            }
            if (getStartedLink) {
                getStartedLink.style.display = 'none';
            }
        }
    }

    updateHeaderStatus();
    updateButtonAccess(); // Panggil fungsi baru
});