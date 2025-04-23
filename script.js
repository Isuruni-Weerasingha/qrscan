document.addEventListener('DOMContentLoaded', function() {
    const userForm = document.getElementById('userForm');
    const qrContainer = document.getElementById('qrContainer');
    const qrActions = document.getElementById('qrActions');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const privacyLink = document.getElementById('privacyLink');
    
    let currentQRCode = null;
    
    // Generate QR Code
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(userForm);
        const userData = {
            name: formData.get('name'),
            age: formData.get('age'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            gender: formData.get('gender'),
            timestamp: new Date().toISOString()
        };
        
        const color = formData.get('color');
        const dataString = JSON.stringify(userData, null, 2);
        
        // Clear previous QR code
        if (currentQRCode) {
            currentQRCode.clear();
            qrContainer.innerHTML = '';
        }
        
        // Generate new QR code
        currentQRCode = new QRCode(qrContainer, {
            text: dataString,
            width: 200,
            height: 200,
            colorDark: color,
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Show download and share buttons
        qrActions.style.display = 'flex';
    });
    
    // Download QR Code
    downloadBtn.addEventListener('click', function() {
        if (!currentQRCode) return;
        
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = 'my-qr-code.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
    
    // Share QR Code
    shareBtn.addEventListener('click', async function() {
        if (!currentQRCode) return;
        
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) return;
        
        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'qr-code.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'My QR Code',
                    text: 'Check out my personalized QR code!',
                    files: [file]
                });
            } else {
                // Fallback for browsers that don't support file sharing
                const dataUrl = canvas.toDataURL('image/png');
                const newWindow = window.open();
                newWindow.document.write(`<img src="${dataUrl}" alt="QR Code" style="max-width:100%">`);
            }
        } catch (err) {
            console.error('Error sharing:', err);
            alert('Sharing failed. Please try again or use the download option.');
        }
    });
    
    // Privacy policy link
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Privacy Policy: We respect your privacy. The information you provide is only used to generate your QR code and is not stored on our servers. The QR code is generated locally in your browser.');
    });
    
    // Form validation
    userForm.addEventListener('input', function(e) {
        if (e.target.validity) {
            if (e.target.validity.valid) {
                e.target.classList.remove('invalid');
            } else {
                e.target.classList.add('invalid');
            }
        }
    });
});