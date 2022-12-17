main();

async function main() {
  const temperatureDisplay = document.getElementById("temperatureDisplay");
  const humidityDisplay = document.getElementById("humidityDisplay");
  const i2cAccess = await navigator.requestI2CAccess();
  const port = i2cAccess.ports.get(1);
  const sht30 = new SHT30(port, 0x44);
  await sht30.init();
  const gpioAccess = await navigator.requestGPIOAccess(); // GPIO を操作する
  const port1 = gpioAccess.ports.get(26); // 26 番ポートを操作する

  await port1.export("out"); // ポートを出力モードに設定

  while (true) {
    const { humidity, temperature } = await sht30.readData();
    temperatureDisplay.innerHTML = `${temperature.toFixed(2)} ℃`;
    humidityDisplay.innerHTML = `${humidity.toFixed(2)} %`;
    if (temperature.toFixed(2) > 30) {
      // 無限ループwhile (true) {
      // 1秒間隔で LED が点滅します。
      await port1.write(1); // LED を点灯
    } else {
      await port1.write(0);
    }
    await sleep(500);
  }
}
