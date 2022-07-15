

import socket
import time                                                                        
import serial                                                                      
from gpiozero import LED, Button                                                   
from time import strftime                                                                                                                                                                                                                                
ser = serial.Serial('/dev/ttyUSB2',115200)                                         
ser.flushInput()                                                                                                                                                      
rec_buff = ''                                                                      
#esot
alerts_states = [False,False,False]

def when_alarm_1_init_action():                                                        
    print(" - Alarma 1 Activada!")                                                                                                                                    
def when_alarm_1_deinit_action():                                                      
    print(" - Alarma 1 Desactivada!")                                                                                                                                 
def when_alarm_2_init_action():                                                        
    print(" - Alarma 2 Activada!")                                                                                                                                    
def when_alarm_2_deinit_action():                                                      
    print(" - Alarma 2 Desactivada!")                                                                                                                                 
def when_problem_init_action():                                                       
    print(" - Problema Activado!")
def when_problem_deinit_action():                                                      
    print(" - Problema Desactivado!") 

def send_at(command,back,timeout):
    rec_buff = ''
    ser.write((command+'\r\n').encode())
    time.sleep(timeout)
    if ser.inWaiting():
        time.sleep(0.01)
        rec_buff = ser.read(ser.inWaiting())
    if rec_buff != '':
        if back not in rec_buff.decode():
            return 0
        else:
            rec_buff = rec_buff.decode().replace('\r', '').replace('\n','')
            info = rec_buff.replace(command,'').replace(back, '').replace(',OK','')
            return info
    else:
        print ('GPS is not ready')
        return 0

def start_gps():
    print('Starting GPS session...')
    rec_buff = ''
    send_at('AT+CGPS=0','OK',1)
    time.sleep(2)

def stop_gps():
    print('Stopping GPS session...')
    rec_buff = ''
    send_at('AT+CGPS=0','OK',1)
    time.sleep(2)

def get_gps_info(is_alarm):
    data = ''
    gps_attemps = 0
    if is_alarm:
        max_gps_attemps = 1
        print('Es una alarma')
    else:
        max_gps_attemps = 3
    while (not data) and (gps_attemps < max_gps_attemps):
        data = send_at('AT+CGPSINFO','+CGPSINFO: ',1)
        if ',,,,,,' in data:
            print("- GPS NOT READY")
            data = False
        gps_attemps += 1
    if data:
        return data
    else:
        return "GPS ERROR"

def create_socket():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    return sock

def send_socket_message(msg):
    message = bytes(msg,encoding='utf-8')
    server_address = ('192.168.1.44', 3020)
    try:
        print('sending {!r}'.format(msg))
        socket.sendto(message, server_address)
    except:
        print('Error sending message')

def publish_telemetry_msg():
    date = strftime("%d/%m/%y")
    time = strftime("%H:%M:%S")
    gps_info = get_gps_info()
    msg = str(date) + ','
    msg += str(time) + ','
    msg += str(gps_info) + ','
    msg += str(alarm_1.is_pressed) + ','
    msg += str(alarm_2.is_pressed) + ','
    msg += str(problem.is_pressed)
    return msg

print("FIRENO Test Starting...")

print("Creating UDP Socket")
socket = create_socket()

print("Starting GPS")
start_gps()

print("Creating Alarms Inputs")
alarm_1 = Button(3)
alarm_2 = Button(17)

print("Creating Problems Inputs")
problem = Button(27)

alarm_1.is_pressed = when_alarm_1_init_action
alarm_1.is_released = when_alarm_1_deinit_action
alarm_2.is_pressed = when_alarm_2_init_action
alarm_2.is_released = when_alarm_2_deinit_action
problem.is_pressed = when_problem_init_action

print("FIRENO Test Running...")

while True:
    print(alerts_states)
    result = publish_telemetry_msg()
    send_socket_message (result)
    time.sleep(4)
