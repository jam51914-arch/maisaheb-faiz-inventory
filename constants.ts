

import { InventoryItem } from './types';
import React from 'react';

export const CATEGORIES = [
    "Grains & Pulses", "Grains & Flours", "Beverages", "Sweeteners", "Oils & Fats", 
    "Souring Agents", "Salts", "Spices & Masalas", "Sauces & Condiments", 
    "Packaged & Dry Goods", "Ready Mixes & Snacks", "Baking & Desserts", "Canned Goods", 
    "Nuts & Dry Fruits", "Frozen Goods", "Supplies", "Produce", "Dairy", "Meat & Poultry"
];
export const UNITS = ["kg", "g", "liters", "ml", "units", "packs"];

const categorizeItem = (name: string): { category: string; unit: string } => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('daal') || lowerName.includes('dal') || lowerName.includes('chana') || lowerName.includes('moong') || lowerName.includes('arad') || lowerName.includes('masoor') || lowerName.includes('rajma') || lowerName.includes('urad') || lowerName.includes('mug') || lowerName.includes('watana') || lowerName.includes('kathol') || lowerName.includes('chana') || lowerName.includes('chaula')) return { category: 'Grains & Pulses', unit: 'kg' };
    if (lowerName.includes('chawal') || lowerName.includes('gehu') || lowerName.includes('wheat') || lowerName.includes('flour') || lowerName.includes('aato') || lowerName.includes('ravo') || lowerName.includes('maido') || lowerName.includes('besan') || lowerName.includes('thuli') || lowerName.includes('daliya') || lowerName.includes('juwar') || lowerName.includes('bajri') || lowerName.includes('poha') || lowerName.includes('parmal') || lowerName.includes('oats') || lowerName.includes('makhana') || lowerName.includes('sabu dana')) return { category: 'Grains & Flours', unit: 'kg' };
    if (lowerName.includes('tea') || lowerName.includes('coffee') || lowerName.includes('rooh afza')) return { category: 'Beverages', unit: 'units' };
    if (lowerName.includes('sugar') || lowerName.includes('gol') || lowerName.includes('shehed') || lowerName.includes('mithaimadi')) return { category: 'Sweeteners', unit: 'kg' };
    if (lowerName.includes('ghee') || lowerName.includes('oil') || lowerName.includes('butter')) return { category: 'Oils & Fats', unit: 'liters' };
    if (lowerName.includes('imli') || lowerName.includes('kokam') || lowerName.includes('amchur') || lowerName.includes('vinegar') || lowerName.includes('lemon') || lowerName.includes('lime juice') || lowerName.includes('dry mango powder')) return { category: 'Souring Agents', unit: 'kg' };
    if (lowerName.includes('namak') || lowerName.includes('salt')) return { category: 'Salts', unit: 'kg' };
    if (lowerName.includes('sonth') || lowerName.includes('masala') || lowerName.includes('biristo') || lowerName.includes('til') || lowerName.includes('mirch') || lowerName.includes('haldi') || lowerName.includes('jeeru') || lowerName.includes('dhaniya') || lowerName.includes('lavang') || lowerName.includes('elaichi') || lowerName.includes('miri') || lowerName.includes('methi') || lowerName.includes('taj') || lowerName.includes('tejpatta') || lowerName.includes('badiya') || lowerName.includes('rai') || lowerName.includes('ajwaan') || lowerName.includes('kilonji') || lowerName.includes('daal chini') || lowerName.includes('oregano') || lowerName.includes('chilli flake') || lowerName.includes('kesar') || lowerName.includes('garlic powder') || lowerName.includes('kasturi methi')) return { category: 'Spices & Masalas', unit: 'g' };
    if (lowerName.includes('sauce') || lowerName.includes('syrup') || lowerName.includes('crush') || lowerName.includes('jam') || lowerName.includes('achaar') || lowerName.includes('mayonese')) return { category: 'Sauces & Condiments', unit: 'units' };
    if (lowerName.includes('sev') || lowerName.includes('papad') || lowerName.includes('boondi') || lowerName.includes('noodles') || lowerName.includes('macroni') || lowerName.includes('pasta') || lowerName.includes('sivaiya') || lowerName.includes('chocos') || lowerName.includes('corn flakes') || lowerName.includes('chevda') || lowerName.includes('toast') || lowerName.includes('konkos')) return { category: 'Packaged & Dry Goods', unit: 'packs' };
    if (lowerName.includes('gulab jamun') || lowerName.includes('dahi wada') || lowerName.includes('khaman dhokla') || lowerName.includes('idli mix') || lowerName.includes('jaljira') || lowerName.includes('rasgulla')) return { category: 'Ready Mixes & Snacks', unit: 'packs' };
    if (lowerName.includes('milk powder') || lowerName.includes('khopru') || lowerName.includes('cornflour') || lowerName.includes('custurd powder') || lowerName.includes('baking powder') || lowerName.includes('gundar') || lowerName.includes('china grass') || lowerName.includes('choclate powder') || lowerName.includes('wip cream')) return { category: 'Baking & Desserts', unit: 'g' };
    if (lowerName.includes('fruit cocktail') || lowerName.includes('pineapple slice')) return { category: 'Canned Goods', unit: 'units' };
    if (lowerName.includes('kaju') || lowerName.includes('badam') || lowerName.includes('zardalu') || lowerName.includes('charoli') || lowerName.includes('kismis') || lowerName.includes('magaj tari') || lowerName.includes('khajoor') || lowerName.includes('pista') || lowerName.includes('kaharak') || lowerName.includes('seeng dana')) return { category: 'Nuts & Dry Fruits', unit: 'kg' };
    if (lowerName.includes('frozen')) return { category: 'Frozen Goods', unit: 'kg' };
    if (lowerName.includes('theli') || lowerName.includes('foil paper') || lowerName.includes('roll') || lowerName.includes('glass')) return { category: 'Supplies', unit: 'packs' };
    if (lowerName.includes('baigan') || lowerName.includes('beetroot') || lowerName.includes('paapri') || lowerName.includes('valor') || lowerName.includes('kolu') || lowerName.includes('methi bhaaji') || lowerName.includes('cholai bhaaji') || lowerName.includes('muli') || lowerName.includes('gaajar') || lowerName.includes('piyaj') || lowerName.includes('bateta') || lowerName.includes('cauli flower') || lowerName.includes('tomato') || lowerName.includes('guwar') || lowerName.includes('bhinda') || lowerName.includes('adrak') || lowerName.includes('lasan') || lowerName.includes('palak') || lowerName.includes('kothmir') || lowerName.includes('phudinu') || lowerName.includes('kaari patta') || lowerName.includes('fanshi') || lowerName.includes('shimla mirch') || lowerName.includes('kakri') || lowerName.includes('karela') || lowerName.includes('patta gobi') || lowerName.includes('turai') || lowerName.includes('tindoli') || lowerName.includes('corn') || lowerName.includes('aam') || lowerName.includes('loki') || lowerName.includes('spring onion') || lowerName.includes('sevta singh') || lowerName.includes('mushroom') || lowerName.includes('baby corn')) return { category: 'Produce', unit: 'kg' };
    if (lowerName.includes('cheese') || lowerName.includes('dahi') || lowerName.includes('milk') || lowerName.includes('cream')) return { category: 'Dairy', unit: 'units' };
    if (lowerName.includes('fish') || lowerName.includes('gosh') || lowerName.includes('chiken') || lowerName.includes('mutton') || lowerName.includes('kaleji') || lowerName.includes('bhejo') || lowerName.includes('paya') || lowerName.includes('haddi') || lowerName.includes('bawra') || lowerName.includes('mundi') || lowerName.includes('egg')) return { category: 'Meat & Poultry', unit: 'kg' };
    return { category: 'Packaged & Dry Goods', unit: 'units' };
};

const getDateWithOffset = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const itemNames: string[] = [
    "tuwar daal", "akkha masoor", "masoor daal", "chana daal", "arad daal", "moong daal", "moongdaal chiltawali", "mug", "tea", "sugar", "chawal", "wheat flour", "manda aato", "ghee", "oil", "ravo", "maido", "besan", "Ragra besan(nuqti)", "thuli", "imli", "namak piso", "khado namak", "senda namak", "kabuli chana", "kaala chana", "gol", "daliya", "seeng dana", "khandela gehu", "kokam", "amchur", "sonth powder", "kaadi masala", "biristo", "til", "lal mirch akkha", "lal mirch gol", "shezvan sauce", "tomato sauce", "red chilli sauce", "green chilli sauce", "soya sauce", "vinegar", "chat masala", "china grass", "sev", "rooh afza", "gulab jamun", "dahi wada", "macroni", "milk powder", "khopru khamand", "cornflour", "custurd powder", "fruit cocktail", "variyali", "haldi", "jeeru", "shahi jeera", "dhaniya powder", "red chilli powder", "garam masala powder", "lavang", "elaichi green", "badi elaichi", "kala miri akkhi", "kala miri powder", "kasturi methi", "taj lakri", "tejpatta", "methidana", "badiya na phool", "white paper powder", "rai", "akkha dhana", "ajwaan", "frozen mutter", "frozen corn", "meggie cube", "papad", "boondi", "kaju", "badam", "zardalu", "charoli", "kismis", "magaj tari", "meetha soda", "noodles", "pao bhaji masala", "chicken tandoori masala", "chicken angara masala", "mutton nihari masala", "poha", "ratlami sev", "shehed", "kilonji", "khajoor", "juwar", "bajri", "chaula", "amul butter", "jam", "milk tatra pack", "safra roll", "plastic theli", "garbage theli", "baigan", "beetroot", "paapri", "valor", "kolu", "methi bhaaji", "cholai bhaaji", "muli", "gaajar", "piyaj", "bateta", "cauli flower", "tomato", "guwar", "bhinda", "mirchi", "adrak", "lasan", "lemon", "palak", "kothmir", "phudinu", "kaari patta", "fanshi", "shimla mirch", "kakri", "karela", "patta gobi", "turai", "Tindoli", "corn", "malas kacha aam", "malas variyali", "malas lime", "malas water melo", "lime juice", "choclate syrup", "Malas mango crush", "malas orange crush", "pizza pasta sauce", "straberry crush", "rose crush", "kachi keri achaar", "limbu achaar", "foil paper", "chocos", "corn flakes", "konkos", "baking powder", "parmal", "green custard powder", "yellow custard powder", "white custard powder", "daal chini", "oregano", "chilli flake", "dry mango powder", "rose water", "shaan chiken masal", "tukmuria", "kaharak", "kadai masala", "laal mirchi powder", "ankha urad", "rajma", "sivaiya", "wip cream", "idli mix", "gulab jamun", "khaman dhokla", "jaljira", "mustard sauce", "choclate powder", "baby corn", "rasgulla", "pineapple slice", "sabu dana", "bbq sauce", "malas kaala khatta", "chevda", "vimal butter", "cheese", "loki", "spring onion", "pudinu", "sevta singh", "amul cream", "pasta", "garlic powder", "mayonese", "mushroom", "gulab jamun mix", "dahi", "toast", "glass", "kaaju kani", "akha moong", "fish", "gosh", "chiken", "Uttam Maido", "mithaimadi", "kashmiri lal powder", "resham patta", "kaju tukda", "olive oil", "shawarma roti", "KALEJI GURDA", "gundar", "lasan kali", "PISTA AKHA", "BADAM KATRAN", "PISTA KATRAN", "WATANA KATHOL", "OATS", "frozen watana", "frozen paratha", "makhana", "bhejo", "paya", "haddi", "bawra", "mundi", "egg", "kesar"
];

export const INITIAL_INVENTORY: InventoryItem[] = itemNames.map((name, index) => {
    const { category, unit } = categorizeItem(name);
    
    let quantity = 50;
    let purchasePrice = 100;
    let lowStockThreshold = 10;
    let expiryDate: string | undefined = getDateWithOffset(180); // Default 6 months for dry goods

    if (unit === 'g') {
        quantity = 500;
        purchasePrice = 50;
        lowStockThreshold = 100;
    }
    
    if (category === 'Produce') {
        quantity = 10;
        purchasePrice = 40 + Math.floor(Math.random() * 40);
        lowStockThreshold = 3;
        expiryDate = getDateWithOffset(7); // 1 week for produce
    } else if (category === 'Dairy' || category === 'Meat & Poultry') {
        quantity = 15;
        purchasePrice = 150 + Math.floor(Math.random() * 100);
        lowStockThreshold = 5;
        expiryDate = getDateWithOffset(5); // 5 days for dairy/meat
    } else if (category === 'Spices & Masalas') {
        purchasePrice = 30 + Math.floor(Math.random() * 70);
    } else if (category === 'Nuts & Dry Fruits') {
        purchasePrice = 500 + Math.floor(Math.random() * 500);
    } else if (category === 'Frozen Goods') {
         expiryDate = getDateWithOffset(90);
    } else if (name === 'egg') {
        expiryDate = getDateWithOffset(21);
    } else if (name.toLowerCase().includes('achaar')) {
        expiryDate = getDateWithOffset(365);
    } else if (name.toLowerCase().includes('sauce')) {
        expiryDate = getDateWithOffset(270);
    }


    return {
        id: index + 1,
        name: name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        category,
        quantity,
        unit,
        purchasePrice,
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate,
        lowStockThreshold,
        lastUpdated: new Date().toISOString()
    };
});


// FIX: Converted JSX to React.createElement calls to be valid in a .ts file
export const ICONS = {
    dashboard: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" })),
    inventory: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" })),
    billing: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" })),
    reports: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" })),
    history: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" })),
    chevronLeft: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" })),
    chevronRight: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })),
    plus: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z", clipRule: "evenodd" })),
    edit: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" })),
    trash: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z", clipRule: "evenodd" })),
    warning: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })),
    ai: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 16.5h4.5m-4.5-4.5h4.5m-4.5-4.5h4.5M3 16.5c0-3.314 2.686-6 6-6h6c3.314 0 6 2.686 6 6v-1.5c0-3.314-2.686-6-6-6h-6c-3.314 0-6 2.686-6 6v1.5Z" })),
    inwards: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M3 3a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H3zm10 4a1 1 0 10-2 0v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 9.586V7z", clipRule: "evenodd" })),
    outwards: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z", clipRule: "evenodd" })),
    print: React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm-8 6a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z", clipRule: "evenodd" }))
};