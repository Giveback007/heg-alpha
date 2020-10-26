from: --DEVICE INSTRUCTIONS-- in 
https://github.com/moothyknight/HEG_ESP32/blob/master/Device_README.txt

HEG serial/ble/wifi commands:
't' - Turns sensor on, you'll see a data stream if the sensor is isolated, as in contacting your skin and not exposed to ambient light.
'f' - Sensor off.
'W' - Reset WiFi to default access point mode (wipes saved credentials).
'u' - toggles USB only streaming. Toggles back to WiFi mode (default)
'B' - Toggle Bluetooth Serial mode. Resets device to be in BTSerial mode. Enter 'B' again to swap back. Can connect to this via standard serial monitors.
'b' - Toggle BLE mode, this resets the device to start in BLE mode, so you have to enter 'b' again through the serial or BLE connection to switch back to WiFi.
'R' - hard resets the ESP32.
'S' - places ESP32 in deep sleep mode, reset power (press the reset button on the device) to re-activate
's' - soft resets the sensor data.
'p' - really basic pIR setting. Just turns the LEDs off as the photodiode picks up radiant heat from your body.
'0','1','2','3' - Changes ADC channel the device reads, in the case of multiple light sensors.
'5' - Read differential between A0 and A1 on ADS1115 to reduce noise (e.g. connect A1 to signal ground).
'6' - Read differential between A2 and A3 on ADS1115.
'D' - toggles ADC debugging (serial only).
'L' - toggles LED ambient light cancellation .
'T' - LED/PD test function. Not finished, easier to just check the 't' output real quick.

With extra sensors:
'l' - toggles sensor 0 (channel 0) and LED set 0.
'c' - toggles sensor 0 (channel 0) and LED set 2.
'r' - toggles sensor 1 (channel 2) and LED set 3.