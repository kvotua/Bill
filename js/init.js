import { checkData } from './checkData.js';
import { renderCheck, diffItems } from './items.js';
import { renderTotalPrice } from './total-price.js';
import { renderCoin } from './coin.js';
import { renderGifts, diffGifts } from './gifts.js';

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

  setTimeout(() => {
    let diffItem3 = diffItems([
      {
        id: 13234,
        name: 'Светлое',
        quantity: 3,
        unit: 'л',
        price: 320,
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
    renderCheck(diffItem3);

    diffGift = diffGifts([
      {
        id: 34234,
        isActive: true,
        title: '0,5 Craft Beer',
        emodzi: '🍻',
        isDropdown: true,
        dropDownList: [
          { id: 2112, title: 'ИПА' },
          { id: 3434, title: 'Марципановое' },
          { id: 2342, title: 'Тыквенный эль' },
          { id: 2343, title: 'Вишневое гозе' },
        ],
      },
      {
        id: 343432,
        isActive: false,
        title: 'Джерки свинные',
        emodzi: '🥓',
        isDropdown: false,
      },
    ]);

    // renderGifts(diffGift);
    renderTotalPrice({ totalPrice: 1800, usePoints: 50, hasUser: true });
  }, 6000);

  setTimeout(() => {
    let diffItem4 = diffItems([
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
      {
        id: 342131,
        name: 'Марципановое',
        quantity: 2,
        unit: 'л',
        price: 250,
      },
      {
        id: 343111,
        name: 'Жига',
        quantity: 2,
        unit: 'л',
        price: 250,
      },
    ]);
    renderCheck(diffItem4);
    renderTotalPrice({ totalPrice: 1700, usePoints: 0, hasUser: true });
    renderCoin({
      hasUser: initData.hasUser,
      currentPoints: initData.currentPoints,
      usePoints: 0,
      pointsPerRub: initData.pointsPerRub,
    });
    diffGift = diffGifts([
      {
        id: 34284,
        isActive: false,
        title: '0,5 Craft Beer',
        emodzi: '🍻',
        isDropdown: true,
        dropDownList: [
          { id: 2112, title: 'ИПА' },
          { id: 3434, title: 'Марципановое' },
          { id: 2342, title: 'Тыквенный эль' },
          { id: 2343, title: 'Вишневое гозе' },
        ],
      },
      {
        id: 34234,
        isActive: true,
        title: '0,5 Craft Beer',
        emodzi: '🍻',
        isDropdown: true,
        dropDownList: [
          { id: 2112, title: 'ИПА' },
          { id: 3434, title: 'Марципановое' },
          { id: 2342, title: 'Тыквенный эль' },
          { id: 2343, title: 'Вишневое гозе' },
        ],
      },
      {
        id: 343,
        isActive: false,
        title: 'Джерки говяжьи',
        emodzi: '🥓',
        isDropdown: false,
      },
    ]);

    // renderGifts(diffGift);
  }, 8000);
}

document.addEventListener('DOMContentLoaded', updateData(checkData));
