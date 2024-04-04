 document.addEventListener('DOMContentLoaded', function() {
            const params = new URLSearchParams(window.location.search);
            const value = params.get('value');
            const output = document.getElementById('bug-number-display');
            output.textContent = `[${value}]`;
});