/*
    Fits built objects together and into the DOM
*/

import {buildItem} from './build.js';

export function renderList(data, accordionEl) {
  accordionEl.innerHTML = '';
  data.forEach((item, index) => {
    accordionEl.insertAdjacentHTML('beforeend', buildItem(item, index));
  });
}