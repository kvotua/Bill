// 📊 ДАННЫЕ ПРИЛОЖЕНИЯ
const checkData = {
  items: [
    {
      id: 13234,
      name: 'Пицца Маргарита',
      quantity: 1,
      unit: 'шт',
      price: 850,
    },
    {
      id: 3442,
      name: 'Кофе Латте',
      quantity: 2,
      unit: 'шт',
      price: 300,
    },
  ],
  totalPrice: 1450,
  hasUser: true,
  fio: 'Иван Иванович',
  currentPoints: 150,
  usePoints: 0,
  pointsPerRub: 10,
  hasGifts: true,
  gifts: [
    {
      id: 2341,
      isActive: true,
      title: '0,5 Classic Beer',
      emodzi: '🍻',
      description: 'Нажми и Выбери',
      isDropdown: true,
      dropDownList: ['Светлое', 'Темное'] // ДОБАВЛЕН dropDownList
    },
  ],
};

// 🛠️ УТИЛИТЫ
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

function calculateTotalPrice() {
  return checkData.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

function getNextItemId() {
  return checkData.items.length > 0
    ? Math.max(...checkData.items.map(item => item.id)) + 1
    : 1;
}

function getNextGiftId() {
  return checkData.gifts.length > 0
    ? Math.max(...checkData.gifts.map(gift => gift.id)) + 1
    : 1;
}

// 📦 ФУНКЦИИ ДЛЯ РАБОТЫ С ТОВАРАМИ
function createCheckItem(item) {
  const itemLine = document.createElement('div');
  itemLine.className = 'item-line';
  itemLine.setAttribute('data-item-id', item.id);

  itemLine.innerHTML = `
    <span class="item-name">${item.name}</span>
    <span class="dotted-line"></span>
    <span class="item-quantity">${item.quantity} ${item.unit}</span>
    <span class="dotted-line low"></span>
    <span class="item-price">${formatPrice(item.price * item.quantity)}</span>
  `;

  return itemLine;
}

function renderCheck() {
  const container = document.getElementById('checkItems');
  container.innerHTML = '';

  // УБРАНА СОРТИРОВКА - сохраняем исходный порядок
  checkData.items.forEach(item => {
    container.appendChild(createCheckItem(item));
  });
}

// 1. ДОБАВЛЕНИЕ ТОВАРА С АНИМАЦИЕЙ
function addItem(newItem) {
  if (!newItem.id) {
    newItem.id = getNextItemId();
  }

  checkData.items.push(newItem);

  // Пересчитываем общую цену и обновляем с анимацией
  const newTotalPrice = calculateTotalPrice();
  updateTotalPriceWithAnimation(newTotalPrice);

  const container = document.getElementById('checkItems');
  const element = createCheckItem(newItem);
  element.classList.add('new-item');
  container.appendChild(element);

  setTimeout(() => {
    element.classList.remove('new-item');
  }, 600);

  return newItem.id;
}

// 2. УДАЛЕНИЕ ТОВАРА ПО ID С АНИМАЦИЕЙ
function removeItemById(itemId) {
  const itemIndex = checkData.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    console.warn('Товар с ID', itemId, 'не найден');
    return false;
  }

  const item = checkData.items[itemIndex];
  const element = document.querySelector(`[data-item-id="${itemId}"]`);

  if (element) {
    element.classList.add('removing');
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 400);
  }

  checkData.items.splice(itemIndex, 1);

  // Пересчитываем общую цену и обновляем с анимацией
  const newTotalPrice = calculateTotalPrice();
  updateTotalPriceWithAnimation(newTotalPrice);

  return true;
}

// 3. ОБНОВЛЕНИЕ ТОВАРА ПО ID С АНИМАЦИЕЙ
function updateItemById(itemId, updates) {
  const itemIndex = checkData.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) {
    console.warn('Товар с ID', itemId, 'не найден');
    return false;
  }

  const oldItem = checkData.items[itemIndex];
  checkData.items[itemIndex] = { ...oldItem, ...updates };

  const element = document.querySelector(`[data-item-id="${itemId}"]`);
  if (element) {
    element.classList.add('updating');

    // Обновляем количество с анимацией
    const quantityElement = element.querySelector('.item-quantity');
    if (quantityElement && oldItem.quantity !== updates.quantity) {
      quantityElement.classList.add('quantity-changing');
      quantityElement.textContent = `${updates.quantity || oldItem.quantity} ${oldItem.unit}`;
      setTimeout(
        () => quantityElement.classList.remove('quantity-changing'),
        500
      );
    }

    // Обновляем цену
    const priceElement = element.querySelector('.item-price');
    if (priceElement) {
      const currentItem = checkData.items[itemIndex];
      priceElement.textContent = formatPrice(
        currentItem.price * currentItem.quantity
      );
    }

    setTimeout(() => element.classList.remove('updating'), 500);
  }

  // Пересчитываем общую цену и обновляем с анимацией
  const newTotalPrice = calculateTotalPrice();
  updateTotalPriceWithAnimation(newTotalPrice);

  return true;
}

// 4. ПОЛУЧЕНИЕ ТОВАРА ПО ID
function getItem(itemId) {
  return checkData.items.find(item => item.id === itemId);
}

// 5. ОБНОВЛЕНИЕ ИТОГОВОЙ ЦЕНЫ С АНИМАЦИЕЙ
function updateTotalPriceWithAnimation(newTotalPrice) {
  const priceElement = document.getElementById('price');
  const wrapper = document.querySelector('.price-animation-wrapper');
  const currentPrice = checkData.totalPrice;

  if (currentPrice === newTotalPrice) {
    checkData.totalPrice = newTotalPrice;
    billInfo();
    return;
  }

  // Если есть списанные баллы - сложная анимация
  if (checkData.usePoints > 0) {
    animatePriceWithPoints(newTotalPrice);
  } else {
    // Простая анимация изменения числа
    animateSimplePriceChange(newTotalPrice);
  }

  checkData.totalPrice = newTotalPrice;
}

function animateSimplePriceChange(newTotalPrice) {
  const priceElement = document.getElementById('price');
  const currentPrice = checkData.totalPrice;
  const duration = 800;
  const stepTime = 30;

  const diff = newTotalPrice - currentPrice;
  const steps = Math.floor(duration / stepTime);
  const stepValue = diff / steps;

  let currentStep = 0;
  priceElement.classList.add('updating');

  function updateStep() {
    if (currentStep >= steps) {
      priceElement.textContent = formatPrice(newTotalPrice);
      setTimeout(() => priceElement.classList.remove('updating'), 300);
      return;
    }

    const intermediatePrice = Math.round(
      currentPrice + stepValue * currentStep
    );
    priceElement.textContent = formatPrice(intermediatePrice);

    currentStep++;
    setTimeout(updateStep, stepTime);
  }

  updateStep();
}

function animatePriceWithPoints(newTotalPrice) {
  const wrapper = document.querySelector('.price-animation-wrapper');
  const currentPrice = checkData.totalPrice;
  const finalPrice = newTotalPrice - checkData.usePoints;

  // Создаем старую цену для анимации
  const oldPriceElement = document.createElement('span');
  oldPriceElement.className = 'old-price';
  oldPriceElement.textContent = formatPrice(currentPrice);

  // Создаем новую цену
  const newPriceElement = document.createElement('span');
  newPriceElement.className = 'new-price';
  newPriceElement.textContent = formatPrice(finalPrice);

  // Заменяем содержимое
  wrapper.innerHTML = '';
  wrapper.appendChild(oldPriceElement);
  wrapper.appendChild(newPriceElement);

  // Запускаем анимацию
  setTimeout(() => {
    oldPriceElement.classList.add('removing');
    newPriceElement.classList.add('appearing');
  }, 100);

  // Убираем старую цену после анимации
  setTimeout(() => {
    wrapper.innerHTML = '';
    wrapper.appendChild(newPriceElement);
  }, 600);
}

// 6. ОБНОВЛЕНИЕ БАЛЛОВ С АНИМАЦИЕЙ
function updatePointsWithAnimation(newPoints, newUsePoints, newPointsPerRub) {
  const pointsContainer = document.getElementById('pointsContainer');
  pointsContainer.classList.add('points-changing');

  setTimeout(() => {
    const oldPoints = checkData.currentPoints;
    const oldUsePoints = checkData.usePoints;
    const oldPointsPerRub = checkData.pointsPerRub;

    checkData.currentPoints = newPoints;
    checkData.usePoints = newUsePoints;
    checkData.pointsPerRub = newPointsPerRub;

    // Анимируем изменение чисел
    animatePointsChange(
      oldPoints,
      newPoints,
      oldUsePoints,
      newUsePoints,
      oldPointsPerRub,
      newPointsPerRub
    );

    // Обновляем отображение цены если изменились списанные баллы
    if (newUsePoints !== oldUsePoints) {
      billInfo();
    }

    setTimeout(() => {
      pointsContainer.classList.remove('points-changing');
    }, 600);
  }, 300);
}

// АНИМАЦИЯ ИЗМЕНЕНИЯ БАЛЛОВ
function animatePointsChange(
  oldPoints,
  newPoints,
  oldUsePoints,
  newUsePoints,
  oldPointsPerRub,
  newPointsPerRub
) {
  const duration = 800;
  const stepTime = 30;
  const steps = Math.floor(duration / stepTime);

  let currentStep = 0;

  function updateStep() {
    if (currentStep >= steps) {
      // Финальное обновление
      coinInfo();
      return;
    }

    // Вычисляем промежуточные значения
    const progress = currentStep / steps;

    const currentPointsValue = Math.round(
      oldPoints + (newPoints - oldPoints) * progress
    );
    const currentUsePointsValue = Math.round(
      oldUsePoints + (newUsePoints - oldUsePoints) * progress
    );
    const currentPointsPerRubValue = Math.round(
      oldPointsPerRub + (newPointsPerRub - oldPointsPerRub) * progress
    );

    // Временно обновляем отображение
    updatePointsDisplay(
      currentPointsValue,
      currentUsePointsValue,
      currentPointsPerRubValue
    );

    currentStep++;
    setTimeout(updateStep, stepTime);
  }

  updateStep();
}

// ВРЕМЕННОЕ ОБНОВЛЕНИЕ ОТОБРАЖЕНИЯ БАЛЛОВ
function updatePointsDisplay(currentPoints, usePoints, pointsPerRub) {
  const container = document.getElementById('pointsContainer');
  if (!container) return;

  const finalPoints = currentPoints - usePoints + pointsPerRub;
  let equationHTML = '';

  equationHTML += `
    <div class="equation-item">
      <div class="points-row">
        <span class="points-value updating">${currentPoints}</span>
        <img src="./assets/coinBack.png" class="coin-icon" />
      </div>
      <span class="points-label">у вас на счету</span>
    </div>
  `;

  if (usePoints > 0) {
    equationHTML += `<span class="operator"> - </span>`;
    equationHTML += `
      <div class="equation-item">
        <div class="points-row">
          <span class="points-value updating">${usePoints}</span>
          <img src="./assets/coinBack.png" class="coin-icon" />
        </div>
        <span class="points-label">списано</span>
      </div>
    `;
  }

  if (pointsPerRub > 0) {
    equationHTML += `<span class="operator"> + </span>`;
    equationHTML += `
      <div class="equation-item">
        <div class="points-row">
          <span class="points-value updating">${pointsPerRub}</span>
          <img src="./assets/coinBack.png" class="coin-icon" />
        </div>
        <span class="points-label">накопите</span>
      </div>
    `;
  }

  if (usePoints > 0 || pointsPerRub > 0) {
    equationHTML += `<span class="operator"> = </span>`;
    equationHTML += `
      <div class="equation-item">
        <div class="points-row">
          <span class="points-value final updating">${finalPoints}</span>
          <img src="./assets/coinBack.png" class="coin-icon" />
        </div>
        <span class="points-label">станет</span>
      </div>
    `;
  }

  container.innerHTML = equationHTML;
}

// ОБНОВЛЕННАЯ coinInfo БЕЗ АНИМАЦИИ (для финального отображения)
function coinInfo() {
  if (!checkData.hasUser) return;

  const container = document.getElementById('pointsContainer');
  if (!container) {
    console.error('Элемент #pointsContainer не найден');
    return;
  }

  const finalPoints =
    checkData.currentPoints - checkData.usePoints + checkData.pointsPerRub;
  let equationHTML = '';

  equationHTML += `
    <div class="equation-item">
      <div class="points-row">
        <span class="points-value">${checkData.currentPoints}</span>
        <img src="./assets/coinBack.png" class="coin-icon" />
      </div>
      <span class="points-label">у вас на счету</span>
    </div>
  `;

  if (checkData.usePoints > 0) {
    equationHTML += `<span class="operator"> - </span>`;
    equationHTML += `
      <div class="equation-item">
        <div class="points-row">
          <span class="points-value">${checkData.usePoints}</span>
          <img src="./assets/coinBack.png" class="coin-icon" />
        </div>
        <span class="points-label">списано</span>
      </div>
    `;
  }

  if (checkData.pointsPerRub > 0) {
    equationHTML += `<span class="operator"> + </span>`;
    equationHTML += `
      <div class="equation-item">
        <div class="points-row">
          <span class="points-value">${checkData.pointsPerRub}</span>
          <img src="./assets/coinBack.png" class="coin-icon" />
        </div>
        <span class="points-label">накопите</span>
      </div>
    `;
  }

  if (checkData.usePoints > 0 || checkData.pointsPerRub > 0) {
    equationHTML += `<span class="operator"> = </span>`;
    equationHTML += `
      <div class="equation-item">
        <div class="points-row">
          <span class="points-value final">${finalPoints}</span>
          <img src="./assets/coinBack.png" class="coin-icon" />
        </div>
        <span class="points-label">станет</span>
      </div>
    `;
  }

  container.innerHTML = equationHTML;
}

// 🎁 ФУНКЦИИ ДЛЯ РАБОТЫ С ПОДАРКАМИ (ОБНОВЛЕННЫЕ)
function createGiftElement(gift) {
  const giftItem = document.createElement('div');
  giftItem.className = 'gift-item';
  giftItem.setAttribute('data-gift-id', gift.id);

  const giftItemBorder = document.createElement('div');
  giftItemBorder.className = 'gift-item-border';

  // Генерируем dropdown из dropDownList если он есть
  let dropdownHTML = '';
  if (gift.isDropdown && gift.dropDownList && gift.dropDownList.length > 0) {
    const dropdownItems = gift.dropDownList.map(item => 
      `<div class="dropdown-item">${item}</div>`
    ).join('');
    
    dropdownHTML = `
      <div class="dropdown" id="dropdown${gift.id}">
        ${dropdownItems}
      </div>
    `;
  } else if (gift.isDropdown) {
    // Значения по умолчанию если dropDownList не указан
    dropdownHTML = `
      <div class="dropdown" id="dropdown${gift.id}">
        <div class="dropdown-item">Опция 1</div>
        <div class="dropdown-item">Опция 2</div>
        <div class="dropdown-item">Опция 3</div>
      </div>
    `;
  }

  giftItemBorder.innerHTML = `
    <div class="gift-icon">${gift.emodzi}</div>
    <div class="gift-text">${gift.title}</div>
    ${gift.isDropdown ? '<br/>' : ''}
    ${gift.isDropdown ? '<span class="choose-button" onclick="toggleDropdown(\'dropdown' + gift.id + '\')">Выбрать</span>' : ''}
    ${dropdownHTML}
  `;

  giftItem.appendChild(giftItemBorder);
  setupGiftInteractions(giftItem);
  return giftItem;
}

function createCouponElement(gift) {
  const couponItem = document.createElement('div');
  couponItem.className = 'coupon-item';
  couponItem.setAttribute('data-gift-id', gift.id);

  couponItem.innerHTML = `
    <div class="coupon-container">
      <div class="gift-icon">🎫</div>
      <div class="coupon-text">+1 Купон</div>
      <br/>
      <div class="erase-button">стереть</div>
    </div>
  `;

  setupGiftInteractions(couponItem);
  return couponItem;
}

function setupGiftInteractions(giftElement) {
  giftElement.addEventListener('mousedown', function () {
    this.classList.add('active');
  });

  giftElement.addEventListener('mouseup', function () {
    this.classList.remove('active');
  });

  giftElement.addEventListener('mouseleave', function () {
    this.classList.remove('active');
  });

  giftElement.addEventListener('touchstart', function () {
    this.classList.add('active');
  });

  giftElement.addEventListener('touchend', function () {
    this.classList.remove('active');
  });
}

function renderGifts() {
  const giftsContainer = document.getElementById('gifts');
  giftsContainer.innerHTML = '';

  if (!checkData.hasGifts) {
    giftsContainer.style.display = 'none';
    return;
  }

  giftsContainer.style.display = 'flex';

  // УБРАНА СОРТИРОВКА - сохраняем исходный порядок
  checkData.gifts.forEach(gift => {
    let giftElement;
    if (gift.isActive) {
      giftElement = createGiftElement(gift);
    } else {
      giftElement = createCouponElement(gift);
    }
    giftsContainer.appendChild(giftElement);
  });

  if (checkData.gifts.length === 0) {
    giftsContainer.style.display = 'none';
  }

  setupDropdownHandlers();
}

// 7. ДОБАВЛЕНИЕ ПОДАРКА С АНИМАЦИЕЙ
function addGift(giftData) {
  if (!giftData.id) {
    giftData.id = getNextGiftId();
  }

  // Убедимся что есть dropDownList если это dropdown
  if (giftData.isDropdown && !giftData.dropDownList) {
    giftData.dropDownList = ['Опция 1', 'Опция 2', 'Опция 3'];
  }

  if (checkData.gifts.length === 0) {
    const giftsContainer = document.getElementById('gifts');
    giftsContainer.style.display = 'flex';
  }

  checkData.gifts.push(giftData);

  const container = document.getElementById('gifts');
  const element = giftData.isActive
    ? createGiftElement(giftData)
    : createCouponElement(giftData);
  element.classList.add('new-gift');
  container.appendChild(element);

  setTimeout(() => {
    element.classList.remove('new-gift');
  }, 700);

  return giftData.id;
}

// 8. УДАЛЕНИЕ ПОДАРКА ПО ID С АНИМАЦИЕЙ
function removeGiftById(giftId) {
  const giftIndex = checkData.gifts.findIndex(gift => gift.id === giftId);
  if (giftIndex === -1) {
    console.warn('Подарок с ID', giftId, 'не найден');
    return false;
  }

  const element = document.querySelector(`[data-gift-id="${giftId}"]`);
  if (element) {
    element.classList.add('removing-gift');
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 500);
  }

  checkData.gifts.splice(giftIndex, 1);

  if (checkData.gifts.length === 0) {
    const giftsContainer = document.getElementById('gifts');
    giftsContainer.style.display = 'none';
  }

  return true;
}

// 9. ОБНОВЛЕНИЕ ПОДАРКА ПО ID
function updateGiftById(giftId, updates) {
  const giftIndex = checkData.gifts.findIndex(gift => gift.id === giftId);
  if (giftIndex === -1) {
    console.warn('Подарок с ID', giftId, 'не найден');
    return false;
  }

  checkData.gifts[giftIndex] = { ...checkData.gifts[giftIndex], ...updates };
  renderGifts();
  return true;
}

// 10. ПОЛУЧЕНИЕ ПОДАРКА ПО ID
function getGift(giftId) {
  return checkData.gifts.find(gift => gift.id === giftId);
}

// 🎯 ОТОБРАЖЕНИЕ ИНФОРМАЦИИ
function billInfo() {
  const priceElement = document.getElementById('price');
  const wrapper = document.querySelector('.price-animation-wrapper');

  if (!checkData.hasUser) {
    wrapper.innerHTML = `<span class="price">${formatPrice(checkData.totalPrice)}</span>`;
  } else if (checkData.usePoints !== 0) {
    wrapper.innerHTML = `
      <span class="old-price">${formatPrice(checkData.totalPrice)}</span>
      <span class="new-price">${formatPrice(checkData.totalPrice - checkData.usePoints)}</span>
    `;
  } else {
    wrapper.innerHTML = `<span class="price">${formatPrice(checkData.totalPrice)}</span>`;
  }
}

function coinInfo() {
  if (checkData.hasUser) {
    const container = document.getElementById('pointsContainer');
    const finalPoints =
      checkData.currentPoints - checkData.usePoints + checkData.pointsPerRub;
    let equationHTML = '';

    equationHTML += `
      <div class="equation-item">
        <div class="points-row">
          <span class="points-value">${checkData.currentPoints}</span>
          <img src="./assets/coinBack.png" class="coin-icon" />
        </div>
        <span class="points-label">у вас на счету</span>
      </div>
    `;

    if (checkData.usePoints > 0) {
      equationHTML += `<span class="operator"> - </span>`;
      equationHTML += `
        <div class="equation-item">
          <div class="points-row">
            <span class="points-value">${checkData.usePoints}</span>
            <img src="./assets/coinBack.png" class="coin-icon" />
          </div>
          <span class="points-label">списано</span>
        </div>
      `;
    }

    if (checkData.pointsPerRub > 0) {
      equationHTML += `<span class="operator"> + </span>`;
      equationHTML += `
        <div class="equation-item">
          <div class="points-row">
            <span class="points-value">${checkData.pointsPerRub}</span>
            <img src="./assets/coinBack.png" class="coin-icon" />
          </div>
          <span class="points-label">накопите</span>
        </div>
      `;
    }

    if (checkData.usePoints > 0 || checkData.pointsPerRub > 0) {
      equationHTML += `<span class="operator"> = </span>`;
      equationHTML += `
        <div class="equation-item">
          <div class="points-row">
            <span class="points-value final">${finalPoints}</span>
            <img src="./assets/coinBack.png" class="coin-icon" />
          </div>
          <span class="points-label">станет</span>
        </div>
      `;
    }

    container.innerHTML = equationHTML;
  }
}

// 🎪 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
function setupDropdownHandlers() {
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('dropdown-item')) {
      const dropdownItem = e.target;
      const dropdown = dropdownItem.closest('.dropdown');
      const giftItem = dropdown.closest('.gift-item');
      const giftId = parseInt(giftItem.getAttribute('data-gift-id'));
      const giftText = giftItem.querySelector('.gift-text');

      giftText.textContent = dropdownItem.textContent;
      dropdown.classList.remove('active');

      // Обновляем данные
      updateGiftById(giftId, {
        selectedOption: dropdownItem.textContent,
        title: dropdownItem.textContent,
      });
    }
  });

  document.addEventListener('click', function (event) {
    if (
      !event.target.closest('.gift-item') &&
      !event.target.closest('.dropdown')
    ) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
}

function toggleDropdown(id) {
  const dropdown = document.getElementById(id);
  const isActive = dropdown.classList.contains('active');

  document.querySelectorAll('.dropdown').forEach(item => {
    item.classList.remove('active');
  });

  if (!isActive) {
    dropdown.classList.add('active');
  }
}
