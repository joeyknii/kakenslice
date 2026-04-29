(function () {
  const cfg = window.KAKENSLICE_CONFIG;
  if (!cfg) return;

  const fmt = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: cfg.currency || 'GHS'
  });

  const $ = (id) => document.getElementById(id);
  const cakeCards = $('cakeCards');
  const cakeSelect = $('cakeSelect');

  const safeText = (v) => String(v || '').trim();

  cfg.cakes.forEach((cake) => {
    const imageSrc = cfg.images?.cakes?.[cake.id] || '';
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${imageSrc}" alt="${cake.name}" loading="lazy" />
      <div class="card-content">
        <h3>${cake.name}</h3>
        <p>${cake.flavor} flavor</p>
        <span class="price">${fmt.format(cake.basePrice)}</span>
      </div>
    `;
    cakeCards.appendChild(card);

    const option = document.createElement('option');
    option.value = cake.id;
    option.textContent = `${cake.name} (${fmt.format(cake.basePrice)})`;
    cakeSelect.appendChild(option);
  });

  $('heroImage').src = cfg.images?.hero || '';
  $('aboutImage').src = cfg.images?.about || '';

  $('phones').textContent = (cfg.contact?.phones || []).join(' / ');
  $('emailLink').href = `mailto:${cfg.contact?.email || ''}`;
  $('emailLink').textContent = cfg.contact?.email || '';
  $('locationText').textContent = cfg.contact?.locationText || '';
  $('mapFrame').src = cfg.contact?.mapEmbedUrl || '';

  $('whatsappBtn').addEventListener('click', () => {
    const selected = cfg.cakes.find((c) => c.id === cakeSelect.value);
    if (!selected) return;

    const message = [
      'Hello Kakenslice, I would like to place a cake request:',
      `Cake: ${selected.name}`,
      `Size: ${safeText($('size').value)}`,
      `Flavor: ${safeText($('flavor').value) || selected.flavor}`,
      `Design: ${safeText($('design').value)}`,
      `Message on Cake: ${safeText($('message').value)}`,
      `Event Date: ${safeText($('date').value)}`,
      `Extra Notes: ${safeText($('notes').value)}`
    ].join('\n');

    const waUrl = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  $('enrollForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = safeText($('studentName').value);
    const email = safeText($('studentEmail').value);
    const phone = safeText($('studentPhone').value);

    if (!name || !email || !phone) {
      alert('Please complete name, email, and phone before submitting.');
      return;
    }

    const subject = encodeURIComponent('Cake Class Enrollment Request');
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Level: ${safeText($('courseLevel').value)}`,
      `Availability: ${safeText($('availability').value)}`
    ].join('\n'));

    window.location.href = `mailto:${cfg.contact.email}?subject=${subject}&body=${body}`;
  });
})();
