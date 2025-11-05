let currentGiftsState = [];

function createGiftElement(gift) {
  const giftItem = document.createElement('div');
  giftItem.className = 'gift-item gift-scale-appear';
  giftItem.setAttribute('data-gift-id', gift.id);

  const giftItemBorder = document.createElement('div');
  giftItemBorder.className = 'gift-item-border';

  let dropdownHTML = '';
  if (gift.isDropdown && gift.dropDownList && gift.dropDownList.length > 0) {
    const dropdownItems = gift.dropDownList
      .map(
        item =>
          `<div class="dropdown-item"  good-id=${item.id}>${item.title}</div>`
      )
      .join('');

    dropdownHTML = `
      <div class="dropdown" id="dropdown${gift.id}">
        ${dropdownItems}
      </div>
    `;
  }

  giftItemBorder.innerHTML = `
    <div class="gift-icon">${gift.emodzi}</div>
    <div class="gift-text">${gift.title}</div>
    ${dropdownHTML !== '' ? '<br/>' : ''}
    ${dropdownHTML !== '' ? '<span class="choose-button" onclick="toggleDropdown(\'dropdown' + gift.id + '\')">Выбрать</span>' : ''}
    ${dropdownHTML}
  `;

  giftItem.appendChild(giftItemBorder);

  setupGiftInteractions(giftItem);
  setupDropdownHandlers(giftItem);
  currentGiftsState.push(gift);
  return giftItem;
}

export function clearGift() {
  currentGiftsState = [];
}

function createCouponElement(gift) {
  const couponItem = document.createElement('div');
  couponItem.className = 'coupon-item gift-scale-appear';
  couponItem.setAttribute('data-gift-id', gift.id);

  couponItem.innerHTML = `
    <div class="coupon-container">
      <div class="gift-icon">🎫</div>
      <div class="coupon-text">+1 Купон</div>
      <br/>
      <div class="erase-button">стереть</div>
    </div>
  `;

  setupGiftInteractions(couponItem, gift);
  currentGiftsState.push(gift);
  return couponItem;
}

function initSingleScratchCard(cardData) {
  initScratchFunctionality(cardData);
}

function initScratchFunctionality(cardData) {
  const canvas = document.getElementById('canvas-1');
  const startButton = document.querySelector('.start-button');
  const progressInfo = document.querySelector('.progress-info');

  if (!canvas || !startButton) return;

  const ctx = canvas.getContext('2d');
  const scratcher = document.querySelector('.scratch-win__scratcher');

  setTimeout(() => {
    const width = scratcher.offsetWidth;
    const height = scratcher.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#d4af37');
    gradient.addColorStop(0.3, '#a67c00');
    gradient.addColorStop(0.5, '#d4af37');
    gradient.addColorStop(0.8, '#a67c00');
    gradient.addColorStop(1, '#d4af37');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    let isScratchingAllowed = false;
    let isWinTriggered = false;

    setTimeout(() => {
      const modal = document.querySelector('.modal-scratch-and-win');

      const emojiElement = modal.querySelector('.emoji');
      const titleElement = modal.querySelector('.title-emoji');

      if (emojiElement) {
        emojiElement.textContent = cardData.emodzi || '🎁';
      }

      if (titleElement) {
        titleElement.textContent = cardData.title || 'Приз';
      }
    }, 100);

    const scratchHandler = e => {
      if (!isScratchingAllowed) return;

      const clientX = e.clientX ?? (e.touches ? e.touches[0].clientX : 0);
      const clientY = e.clientY ?? (e.touches ? e.touches[0].clientY : 0);

      const canvasRect = canvas.getBoundingClientRect();
      const x = clientX - canvasRect.left;
      const y = clientY - canvasRect.top;

      if (x > 0 && x < width && y > 0 && y < height) {
        ctx.clearRect(x - 30, y - 30, 60, 60);

        const imageData = ctx.getImageData(0, 0, width, height).data;
        const totalPixels = width * height;
        const scratchedPixels = imageData.filter(
          (value, i) => i % 4 === 3 && value === 0
        ).length;
        const scratchedPercent = scratchedPixels / totalPixels;

        if (scratchedPercent > 0.4 && !isWinTriggered) {
          isWinTriggered = true;
          onCardScratched(cardData);
        }
      }
    };

    startButton.addEventListener('click', () => {
      isScratchingAllowed = true;
      startButton.style.display = 'none';
      progressInfo.textContent = 'Стирайте защитный слой...';
      canvas.style.pointerEvents = 'auto';

      canvas.addEventListener('mousemove', scratchHandler);
      canvas.addEventListener('touchmove', scratchHandler, { passive: false });
    });
  }, 100);
}

function onCardScratched(cardData) {
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  });
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.8 },
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.8 },
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  });

  const progressInfo = document.querySelector('.progress-info');
  progressInfo.textContent = `🎉 Поздравляем! Вы выиграли: ${cardData.title}`;
  progressInfo.style.color = '#4CAF50';
  progressInfo.style.fontWeight = 'bold';
  if (cardData.id) {
    const cupons = document.querySelectorAll('.coupon-item');
    const couponWithId = document.querySelector(
      `.coupon-item[data-gift-id="${cardData.id}"]`
    );
    console.log(couponWithId, cardData);
    toggleGiftVisibilityById(cardData.id, true);
    setTimeout(() => {
      hideScratchAndWinModal();
    }, 1200);
  }
}
function toggleGiftVisibilityById(giftId, isActive) {
  // Находим элемент купона по ID
  const couponElement = document.querySelector(
    `.coupon-item[data-gift-id="${giftId}"]`
  );

  if (!couponElement) {
    console.warn(`Купон с ID ${giftId} не найден`);
    return;
  }

  // Находим данные в состоянии
  const giftIndex = currentGiftsState.findIndex(gift => gift.id === giftId);
  if (giftIndex === -1) {
    console.warn(`Подарок с ID ${giftId} не найден в состоянии`);
    return;
  }

  // Обновляем данные в состоянии
  currentGiftsState[giftIndex] = {
    ...currentGiftsState[giftIndex],
    isActive: isActive,
  };

  const becomesGift = isActive === true;
  const parent = couponElement.parentNode;

  // Создаем новый элемент в зависимости от типа
  const newElement = becomesGift
    ? createGiftElement(currentGiftsState[giftIndex])
    : createCouponElement(currentGiftsState[giftIndex]);

  // Заменяем элемент
  parent.replaceChild(newElement, couponElement);

  // Убираем класс анимации после завершения
  setTimeout(() => {
    newElement.classList.remove('gift-scale-appear');
  }, 600);
}

function CardClean() {
  const modal = document.querySelector('.modal-scratch-and-win');
  const canvas = document.getElementById('canvas-1');
  const ctx = canvas.getContext('2d');
  const startButton = document.querySelector('.start-button');
  const emojiElement = modal.querySelector('.emoji');
  const titleElement = modal.querySelector('.title-emoji');
  const scratcher = document.querySelector('.scratch-win__scratcher');

  startButton.style.display = 'flex';

  const width = scratcher.offsetWidth;
  const height = scratcher.offsetHeight;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#d4af37');
  gradient.addColorStop(0.3, '#a67c00');
  gradient.addColorStop(0.5, '#d4af37');
  gradient.addColorStop(0.8, '#a67c00');
  gradient.addColorStop(1, '#d4af37');

  ctx.fillStyle = gradient;

  emojiElement.textContent = '';
  titleElement.textContent = '';

  const progressInfo = document.querySelector('.progress-info');
  progressInfo.style.color = '#ffdc73';
  progressInfo.textContent = 'Сотрите защитный слой';
  canvas.style.pointerEvents = 'none';
}

function setupGiftInteractions(giftElement, gift = {}) {
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

    if (giftElement.classList.contains('coupon-item')) {
      showScratchAndWinModal(gift);
    }
  });

  giftElement.addEventListener('touchend', function () {
    this.classList.remove('active');
  });
}

function setupDropdownHandlers(itemgift) {
  itemgift.addEventListener('click', function (e) {
    const giftItem = e.currentTarget;
    const giftId = parseInt(giftItem.getAttribute('data-gift-id'));

    openGoodSelectionModal(giftId, giftItem);
    return;
  });
}

function openGoodSelectionModal(giftId, giftItem) {
  const giftData = currentGiftsState.find(gift => gift.id === giftId);
  if (!giftData || !giftData.dropDownList) return;

  const modal = document.querySelector('.modal-choose-good');
  modal.classList.add('gift-scale-appear');
  document.body.classList.add('body-blur');
  const goodContainer = modal.querySelector('.good-container');

  goodContainer.innerHTML = '';

  giftData.dropDownList.forEach(item => {
    const goodElement = document.createElement('div');
    goodElement.className = 'good-item';
    goodElement.setAttribute('data-good-id', item.id);
    goodElement.innerHTML = `
      <div class="good-title">${item.title}</div>
      ${item.description ? `<div class="good-description">${item.description}</div>` : ''}
      ${item.image ? `<img src="${item.image}" class="good-image" alt="${item.title}">` : ''}
    `;

    goodElement.addEventListener('click', () => {
      selectGood(giftId, giftItem, item);
      closeModal();
    });

    goodContainer.appendChild(goodElement);
  });

  modal.style.display = 'flex';

  setTimeout(() => {
    modal.classList.remove('gift-scale-appear');
  }, 600);

  const closeModal = () => {
    modal.classList.add('gift-scale-disappear');
    document.body.classList.remove('body-blur');
    setTimeout(() => {
      modal.classList.remove('gift-scale-disappear');
      modal.style.display = 'none';
    }, 600);
  };

  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });
}

function selectGood(giftId, giftItem, selectedItem) {
  const giftText = giftItem.querySelector('.gift-text');

  if (giftText) {
    giftText.textContent = selectedItem.title;
  }

  giftItem.setAttribute('select-good-id', selectedItem.id);
}

export function diffGifts(newGifts) {
  if (currentGiftsState.length === 0) {
    return {
      addGifts: newGifts,
    };
  }

  const newGiftsMap = new Map(newGifts.map(gift => [gift.id, gift]));
  const currentGiftsMap = new Map(
    currentGiftsState.map(gift => [gift.id, gift])
  );

  const giftsToAdd = [];
  const giftsToRemoveIds = [];
  const giftsToEdit = [];

  newGifts.forEach(newGift => {
    if (!currentGiftsMap.has(newGift.id)) {
      giftsToAdd.push(newGift);
    }
  });

  currentGiftsState.forEach(currentGift => {
    if (!newGiftsMap.has(currentGift.id)) {
      giftsToRemoveIds.push(currentGift.id);
    }
  });

  newGifts.forEach(newGift => {
    const currentGift = currentGiftsMap.get(newGift.id);
    if (currentGift) {
      const isTitleChanged = currentGift.title !== newGift.title;
      const isActiveChanged = currentGift.isActive !== newGift.isActive;
      const isEmodziChanged = currentGift.emodzi !== newGift.emodzi; // ← ДОБАВЛЕНО
      const isDropdownChanged = currentGift.isDropdown !== newGift.isDropdown;

      const isDropDownListChanged =
        JSON.stringify(currentGift.dropDownList || []) !==
        JSON.stringify(newGift.dropDownList || []);

      const isSelectedOptionChanged =
        currentGift.selectedOption !== newGift.selectedOption;

      if (
        isTitleChanged ||
        isActiveChanged ||
        isEmodziChanged ||
        isDropdownChanged ||
        isDropDownListChanged ||
        isSelectedOptionChanged
      ) {
        giftsToEdit.push(newGift);
      }
    }
  });

  return {
    addGifts: giftsToAdd.length > 0 ? giftsToAdd : null,
    removeGiftsId: giftsToRemoveIds.length > 0 ? giftsToRemoveIds : null,
    editGifts: giftsToEdit.length > 0 ? giftsToEdit : null,
  };
}

export function renderGifts(gifts) {
  const giftsContainer = document.getElementById('gifts');

  if (gifts.addGifts && gifts.addGifts.length > 0) {
    giftsContainer.style.display = 'flex';
  }
  let timeOut = 0;

  if (gifts.removeGiftsId && gifts.removeGiftsId.length > 0) {
    timeOut = 600;
    gifts.removeGiftsId.forEach(gift => {
      removeGiftById(gift);
    });
  }

  setTimeout(() => {
    if (gifts.editGifts && gifts.editGifts.length > 0) {
      gifts.editGifts.forEach(updatedGift => {
        const giftElement = document.querySelector(
          `[data-gift-id="${updatedGift.id}"]`
        );
        if (giftElement) {
          updateGiftElement(giftElement, updatedGift);
        } else {
          console.warn(
            'Element for gift',
            updatedGift.id,
            'not found for update'
          );
        }
      });
    }

    if (gifts.addGifts && gifts.addGifts.length > 0)
      gifts.addGifts.forEach(gift => {
        let giftElement;
        if (gift.isActive) {
          giftElement = createGiftElement(gift);
        } else {
          giftElement = createCouponElement(gift);
        }
        giftsContainer.appendChild(giftElement);
        setTimeout(() => {
          giftElement.classList.remove('gift-scale-appear');
        }, 600);
      });
  }, timeOut);
}

function removeGiftById(giftId) {
  const element = document.querySelector(`[data-gift-id="${giftId}"]`);
  if (element) {
    element.classList.add('removing-gift');
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 600);
  }

  const giftIndex = currentGiftsState.findIndex(
    gift => gift.id === giftId || gift.id === giftId
  );

  if (giftIndex !== -1) {
    currentGiftsState.splice(giftIndex, 1);
  }

  return true;
}

function updateGiftElement(giftElement, updatedGift) {
  const giftId = giftElement.getAttribute('data-gift-id');

  // Обновляем данные в состоянии
  const giftIndex = currentGiftsState.findIndex(gift => gift.id === giftId);
  if (giftIndex !== -1) {
    currentGiftsState[giftIndex] = {
      ...currentGiftsState[giftIndex],
      ...updatedGift,
    };
  }

  const isCoupon = giftElement.classList.contains('coupon-item');
  const isGift = giftElement.classList.contains('gift-item');
  const becomesGift = updatedGift.isActive === true;
  const becomesCoupon = updatedGift.isActive === false;

  // Если изменился тип (купон ↔ подарок) - пересоздаем элемент
  if ((isCoupon && becomesGift) || (isGift && becomesCoupon)) {
    const parent = giftElement.parentNode;
    const newElement = becomesGift
      ? createGiftElement({ ...currentGiftsState[giftIndex], ...updatedGift })
      : createCouponElement({
          ...currentGiftsState[giftIndex],
          ...updatedGift,
        });

    parent.replaceChild(newElement, giftElement);
    setTimeout(() => {
      newElement.classList.remove('gift-scale-appear');
    }, 600);
    return;
  }

  // Обновляем существующий элемент
  const giftText = giftElement.querySelector('.gift-text');
  const giftIcon = giftElement.querySelector('.gift-icon');
  const giftItemBorder = giftElement.querySelector('.gift-item-border');

  // Обновляем заголовок
  if (updatedGift.title && giftText) {
    giftText.textContent = updatedGift.title;
  }

  // Обновляем иконку
  if (updatedGift.emodzi && giftIcon) {
    giftIcon.textContent = updatedGift.emodzi;
  }

  // Обновляем dropdown (только для подарков)
  if (isGift && giftItemBorder) {
    const existingDropdown = giftElement.querySelector('.dropdown');
    const existingChooseButton = giftElement.querySelector('.choose-button');

    // Если появился/исчез dropdown
    // if (
    //   updatedGift.isDropdown !== undefined ||
    //   updatedGift.dropDownList !== undefined
    // ) {
    //   let dropdownHTML = '';

    //   if (
    //     updatedGift.isDropdown &&
    //     updatedGift.dropDownList &&
    //     updatedGift.dropDownList.length > 0
    //   ) {
    //     const dropdownItems = updatedGift.dropDownList
    //       .map(
    //         item =>
    //           `<div class="dropdown-item" good-id=${item.id}>${item.title}</div>`
    //       )
    //       .join('');

    //     dropdownHTML = `
    //       <div class="dropdown" id="dropdown${giftId}">
    //         ${dropdownItems}
    //       </div>
    //     `;
    //   }

    //   giftItemBorder.innerHTML = `
    //     <div class="gift-icon">${updatedGift.emodzi || giftIcon.textContent}</div>
    //     <div class="gift-text">${updatedGift.title || giftText.textContent}</div>
    //     ${dropdownHTML !== '' ? '<br/>' : ''}
    //     ${dropdownHTML !== '' ? '<span class="choose-button" onclick="toggleDropdown(\'dropdown' + giftId + '\')">Выбрать</span>' : ''}
    //     ${dropdownHTML}
    //   `;

    //   setupGiftInteractions(giftElement);
    //   // setupDropdownHandlers(giftElement);
    // }
  }
}

document.addEventListener('click', function (event) {
  if (!event.target.closest('.gift-item')) {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }

  const modal = document.querySelector('.modal-scratch-and-win');
  if (
    modal &&
    !event.target.closest('.modal-scratch-and-win') &&
    modal.style.display !== 'none' &&
    !event.target.closest('.gift-item')
  ) {
    hideScratchAndWinModal();
  }
});

function showScratchAndWinModal(gift) {
  initSingleScratchCard(gift);

  const modal = document.querySelector('.modal-scratch-and-win');

  modal.classList.add('gift-scale-appear');

  modal.style.display = 'flex';
  document.body.classList.add('body-blur');

  setTimeout(() => {
    modal.classList.remove('gift-scale-appear');
  }, 600);
}

function hideScratchAndWinModal() {
  const modal = document.querySelector('.modal-scratch-and-win');
  modal.classList.add('gift-scale-disappear');
  setTimeout(() => {
    document.body.classList.remove('body-blur');

    modal.classList.remove('gift-scale-disappear');
    CardClean();

    modal.style.display = 'none';
  }, 600);
}
