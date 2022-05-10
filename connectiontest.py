import urllib3
http = urllib3.PoolManager()
import time

import subprocess  # For executing a shell command

def ping(host):
    
    command = ['ping', '-c', '1', host]

    return subprocess.call(command) == 0

def internet_on():
    try:
        r = http.request('GET','http://142.250.78.142', timeout=3)
        print('Si hay conexion a internet')
        return True
    except Exception as e:
        print(e)
        print('No hay conexion a internet')
        return False


def get_msg(msg='',reset=False):
    if (reset == True):
        msg = ''
    msg += 'Datos;'
    return msg

def send_message(message):
    internet_connection = internet_on()
    if (internet_connection == True ):
        print(f'Enviar: {message}')
        return True
    else :
        print(f'Enviar con conexion: {message}')
        return False

message = get_msg()

while True :
    send_state = send_message(message)
    message = get_msg(message,send_state)
    
    time.sleep(5)


