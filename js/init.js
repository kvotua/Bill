import { checkData } from './checkData.js';
import { renderCheck, diffItems, clearCheck } from './items.js';
import { renderTotalPrice } from './total-price.js';
import { renderCoin, clearCoin } from './coin.js';
import { renderGifts, diffGifts, clearGift } from './gifts.js';

function updateData(initData) {
  let diffItem = diffItems(initData.items);
  renderCheck(diffItem);
  renderTotalPrice(initData);
  renderCoin({
    hasUser: initData.hasUser,
    currentPoints: initData.currentPoints,
    usePoints: initData.usePoints,
    pointsPerRub: initData.pointsPerRub,
  });
  let diffGift = diffGifts(initData.gifts);
  renderGifts(diffGift);

  setTimeout(() => {
    let diffItem2 = diffItems([
      {
        id: 13234,
        name: 'Светлое',
        quantity: 1,
        unit: 'л',
        price: 120,
      },
      {
        id: 3442,
        name: 'Темное',
        quantity: 2,
        unit: 'л',
        price: 250,
      },
      {
        id: 23423,
        name: 'Красное',
        quantity: 2,
        unit: 'л',
        price: 250,
      },
      {
        id: 342111,
        name: 'Ипа',
        quantity: 2,
        unit: 'л',
        price: 250,
      },
    ]);
    renderCheck(diffItem2);
    renderTotalPrice({ totalPrice: 1500, usePoints: 50, hasUser: true });
    renderCoin({
      hasUser: initData.hasUser,
      currentPoints: initData.currentPoints,
      usePoints: 50,
      pointsPerRub: initData.pointsPerRub,
    });
  }, 2000);

  // setTimeout(() => {
  //   let diffItem3 = diffItems([
  //     {
  //       id: 13234,
  //       name: 'Светлое',
  //       quantity: 3,
  //       unit: 'л',
  //       price: 320,
  //     },
  //     {
  //       id: 23423,
  //       name: 'Красное',
  //       quantity: 2,
  //       unit: 'л',
  //       price: 250,
  //     },
  //     {
  //       id: 342111,
  //       name: 'Ипа',
  //       quantity: 2,
  //       unit: 'л',
  //       price: 250,
  //     },
  //   ]);
  //   renderCheck(diffItem3);

  //   diffGift = diffGifts([
  //     {
  //       id: 34234,
  //       isActive: true,
  //       title: '0,5 Craft Beer',
  //       emodzi: '🍻',
  //       isDropdown: true,
  //       dropDownList: [
  //         { id: 2112, title: 'ИПА' },
  //         { id: 3434, title: 'Марципановое' },
  //         { id: 2342, title: 'Тыквенный эль' },
  //         { id: 2343, title: 'Вишневое гозе' },
  //       ],
  //     },
  //     {
  //       id: 343432,
  //       isActive: false,
  //       title: 'Джерки свинные',
  //       emodzi: '🥓',
  //       isDropdown: false,
  //     },
  //   ]);

  //   // renderGifts(diffGift);
  //   renderTotalPrice({ totalPrice: 1800, usePoints: 50, hasUser: true });
  // }, 6000);

  // setTimeout(() => {
  //   let diffItem4 = diffItems([
  //     {
  //       id: 23423,
  //       name: 'Красное',
  //       quantity: 2,
  //       unit: 'л',
  //       price: 250,
  //     },
  //     {
  //       id: 342111,
  //       name: 'Ипа',
  //       quantity: 2,
  //       unit: 'л',
  //       price: 250,
  //     },
  //     {
  //       id: 342131,
  //       name: 'Марципановое',
  //       quantity: 2,
  //       unit: 'л',
  //       price: 250,
  //     },
  //     {
  //       id: 343111,
  //       name: 'Жига',
  //       quantity: 2,
  //       unit: 'л',
  //       price: 250,
  //     },
  //   ]);
  //   renderCheck(diffItem4);
  //   renderTotalPrice({ totalPrice: 1700, usePoints: 0, hasUser: true });
  //   renderCoin({
  //     hasUser: initData.hasUser,
  //     currentPoints: initData.currentPoints,
  //     usePoints: 0,
  //     pointsPerRub: initData.pointsPerRub,
  //   });
  //   diffGift = diffGifts([
  //     {
  //       id: 34284,
  //       isActive: false,
  //       title: '0,5 Craft Beer',
  //       emodzi: '🍻',
  //       isDropdown: true,
  //       dropDownList: [
  //         { id: 2112, title: 'ИПА' },
  //         { id: 3434, title: 'Марципановое' },
  //         { id: 2342, title: 'Тыквенный эль' },
  //         { id: 2343, title: 'Вишневое гозе' },
  //       ],
  //     },
  //     {
  //       id: 34234,
  //       isActive: true,
  //       title: '0,5 Craft Beer',
  //       emodzi: '🍻',
  //       isDropdown: true,
  //       dropDownList: [
  //         { id: 2112, title: 'ИПА' },
  //         { id: 3434, title: 'Марципановое' },
  //         { id: 2342, title: 'Тыквенный эль' },
  //         { id: 2343, title: 'Вишневое гозе' },
  //       ],
  //     },
  //     {
  //       id: 343,
  //       isActive: false,
  //       title: 'Джерки говяжьи',
  //       emodzi: '🥓',
  //       isDropdown: false,
  //     },
  //   ]);

  //   // renderGifts(diffGift);
  // }, 8000);

  setTimeout(() => {
    cleanBill();
    // showBanner();
  }, 3200);

  setTimeout(() => {
    showBill();
  }, 5000);
}

function cleanBill() {
  cleanBillAnim();
  clearCheck();
  clearGift();
  clearCoin();
}

document.addEventListener('DOMContentLoaded', updateData(checkData));

function cleanBillAnim() {
  const mainElement = document.querySelector('main');

  calculateAndApplyDelays();

  mainElement.classList.add('stagger-hide');

  const totalDuration = calculateTotalAnimationDuration();
  setTimeout(() => {
    clearBillContent();


  }, totalDuration);
}

function clearBillContent() {
  const checkItems = document.getElementById('checkItems');
  if (checkItems) {
    checkItems.innerHTML = '';
  }

  const gifts = document.getElementById('gifts');
  if (gifts) {
    gifts.innerHTML = '';
    gifts.style.display = 'none';
  }

  const price = document.getElementById('price');
  if (price) {
    price.textContent = '0 ₽';
    price.className = 'price';
  }

  const newPrice = document.getElementById('newPrice');
  if (newPrice) {
    newPrice.remove();
  }

  const pointsContainer = document.getElementById('pointsContainer');
  if (pointsContainer) {
    pointsContainer.innerHTML = '';
    pointsContainer.style.display = 'none';
  }

  const priceWrapper = document.querySelector('.price-animation-wrapper');
  if (priceWrapper) {
    priceWrapper.innerHTML = '<span class="price" id="price">0 ₽</span>';
  }
}

function showBill() {
  const mainElement = document.querySelector('main');

  mainElement.classList.remove('stagger-hide');

  resetCustomDelays();

  void mainElement.offsetWidth;
}

function calculateAndApplyDelays() {
  const mainElement = document.querySelector('main');

  let currentDelay = 0.1; // Начальная задержка

  const title = mainElement.querySelector('.title');
  if (title) {
    title.style.animationDelay = `${currentDelay}s`;
    currentDelay += 0.05;
  }

  const firstLine = mainElement.querySelector('.line:nth-of-type(1)');
  if (firstLine) {
    firstLine.style.animationDelay = `${currentDelay}s`;
    currentDelay += 0.05;
  }

  // Товары (item-line)
  const itemLines = mainElement.querySelectorAll('.item-line');
  itemLines.forEach((item, index) => {
    item.style.animationDelay = `${currentDelay + index * 0.05}s`;
  });

  if (itemLines.length > 0) {
    currentDelay += itemLines.length * 0.05 + 0.05;
  }

  // Подарки (gifts контейнер)
  const gifts = mainElement.querySelector('.gifts');
  if (gifts) {
    gifts.style.animationDelay = `${currentDelay}s`;
    currentDelay += 0.05;
  }

  // Купоны (coupon-item)
  const couponItems = mainElement.querySelectorAll('.coupon-item');
  couponItems.forEach((coupon, index) => {
    coupon.style.animationDelay = `${currentDelay + index * 0.05}s`;
  });

  if (couponItems.length > 0) {
    currentDelay += couponItems.length * 0.05 + 0.05;
  }

  // Вторая линия
  const secondLine = mainElement.querySelector('.line:nth-of-type(2)');
  if (secondLine) {
    secondLine.style.animationDelay = `${currentDelay}s`;
    currentDelay += 0.05;
  }

  // Секция с итогом
  const totalSection = mainElement.querySelector('.total-section');
  if (totalSection) {
    totalSection.style.animationDelay = `${currentDelay}s`;
    currentDelay += 0.05;
  }

  // Третья линия
  const thirdLine = mainElement.querySelector('.line:nth-of-type(3)');
  if (thirdLine) {
    thirdLine.style.animationDelay = `${currentDelay}s`;
    currentDelay += 0.05;
  }

  // Секция с бонусами
  const accountEquation = mainElement.querySelector('.account-equation');
  if (accountEquation) {
    accountEquation.style.animationDelay = `${currentDelay}s`;
    currentDelay += 0.05;
  }

  // Элементы уравнения бонусов
  const equationItems = mainElement.querySelectorAll(
    '.equation-item, .operator'
  );
  equationItems.forEach((item, index) => {
    item.style.animationDelay = `${currentDelay + index * 0.05}s`;
  });

  // Обновляем задержку для empty-state
  const emptyState = mainElement.querySelector('.empty-state');
  if (emptyState) {
    const emptyStateDelay = currentDelay + equationItems.length * 0.05 + 0.3;
    emptyState.style.transitionDelay = `${emptyStateDelay}s`;
  }
}

function resetCustomDelays() {
  const mainElement = document.querySelector('main');
  const allElements = mainElement.querySelectorAll('*');

  allElements.forEach(element => {
    element.style.animationDelay = '';
    element.style.transitionDelay = '';
  });
}

function calculateTotalAnimationDuration() {
  const mainElement = document.querySelector('main');

  let maxDelay = 0;
  const elements = mainElement.querySelectorAll('*');

  elements.forEach(element => {
    const animationDelay = element.style.animationDelay;
    if (animationDelay) {
      const delay = parseFloat(animationDelay);
      if (delay > maxDelay) {
        maxDelay = delay;
      }
    }
  });

  // Добавляем время самой анимации (0.4s) плюс запас
  return (maxDelay + 0.5) * 1000;
}

function showBanner(){
  const banner = document.getElementById('banner');

  banner.classList.add('showAll');
}
