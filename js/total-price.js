export function renderTotalPrice(checkData) {
  const wrapper = document.querySelector('.price-animation-wrapper');
  const price = document.getElementById('price');

  let currentPrice = 0;
  if (price) {
    currentPrice = parsePrice(price.textContent);
  }
  let targetPrice = checkData.totalPrice;

  if (
    !checkData.hasUser ||
    (currentPrice === 0 && (!checkData.usePoints || checkData.usePoints === 0))
  ) {
    targetPrice = checkData.totalPrice;
    animatePrice(price, currentPrice, targetPrice);
  } else if (checkData.usePoints !== 0) {
    const finalPrice = checkData.totalPrice - checkData.usePoints;
    targetPrice = finalPrice;

    animatePrice(price, currentPrice, checkData.totalPrice);
    setTimeout(() => {
      const priceCoins = document.getElementById('newPrice');
      if (priceCoins) {
        animatePrice(priceCoins, parsePrice(priceCoins.innerText), targetPrice);
      } else {
        price.classList.add('old-price');
        const newPrice = document.createElement('span');
        newPrice.id = 'newPrice';
        newPrice.classList.add('price');
        newPrice.innerText = '0 ₽';
        wrapper.appendChild(newPrice);
        animatePrice(newPrice, 0, targetPrice);
      }
    }, 100);
  } else {
    price.classList.remove('old-price');
    const priceCoins = document.getElementById('newPrice');
    if (priceCoins) {
      priceCoins.remove();
    }
    targetPrice = checkData.totalPrice;
    animatePrice(price, currentPrice, targetPrice);
  }
}

function parsePrice(priceString) {
  const numericString = priceString.replace(/[^\d]/g, '');
  return parseFloat(numericString) || 0;
}

function animatePrice(element, startValue, endValue) {
  const duration = 800;
  const startTime = performance.now();

  const startInt = Math.floor(startValue);
  const endInt = Math.floor(endValue);

  function updatePrice(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easeOutQuart = 1 - Math.pow(1 - progress, 4);

    const currentInt = Math.floor(
      startInt + (endInt - startInt) * easeOutQuart
    );

    element.textContent = formatPrice(currentInt);

    if (progress < 1) {
      requestAnimationFrame(updatePrice);
    } else {
      element.textContent = formatPrice(endValue);
    }
  }

  element.textContent = formatPrice(startInt);
  requestAnimationFrame(updatePrice);
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}
