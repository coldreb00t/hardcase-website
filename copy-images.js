const fs = require('fs');
const path = require('path');

console.log('🎨 Копирование логотипов Hardcase...\n');

const logos = [
  'HardCase_Logos-01.png',
  'HardCase_Logos-02.png',
  'HardCase_Logos-16.png'
];

let copied = 0;

logos.forEach(logo => {
  const source = path.join(__dirname, 'Logo/PNG', logo);
  const dest = path.join(__dirname, 'public/images', logo);
  
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✅ ${logo} скопирован`);
      copied++;
    } else {
      console.log(`❌ ${logo} не найден в Logo/PNG/`);
    }
  } catch (err) {
    console.log(`❌ Ошибка при копировании ${logo}:`, err.message);
  }
});

console.log(`\n✨ Готово! Скопировано ${copied} из ${logos.length} логотипов`);

// Проверка результата
console.log('\n📁 Содержимое public/images/:');
try {
  const files = fs.readdirSync(path.join(__dirname, 'public/images'));
  files.forEach(file => console.log(`   - ${file}`));
} catch (err) {
  console.log('   (папка пуста или недоступна)');
}

