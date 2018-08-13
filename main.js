var fs = require('fs');

config_path='.env'

if (!fs.existsSync(config_path)) {
    console.log('Config file does not exist. Quitting!');
    return 1
}

require('dotenv').config({path: config_path})

function get_sensors(bridge_ip,api_user){

  var request = require('request');

  // Set the headers
  var headers = {
      'User-Agent':   'get-temps/0.1',
      'Content-Type': 'application/json'
  }

  // Configure the request
  var options = {
      url: 'http://' + bridge_ip + '/api/' + api_user + '/sensors',
      method: 'GET',
      headers: headers
  }

  return new Promise(function(resolve,reject){
    request(options, function(err,resp,body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  })
}

function update_graph(url,api_key,field1,field2,field3){

  var request = require('request');

  // Set the headers
  var headers = {
      'User-Agent':   'get-temps/0.1',
      'Content-Type': 'application/json'
  }

  // Configure the request
  var options = {
      url: url ,
      method: 'GET',
      headers: headers,
      qs: {'api_key': api_key, 'field1': field1, 'field2': field2, 'field3': field3}
  }

  return new Promise(function(resolve,reject){
    request(options, function(err,resp,body) {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  })
}

function main() {
  var sensorsPromise = get_sensors(process.env.hue_ip, process.env.hue_api_key);

  sensorsPromise.then(function(result) {
    allsensors = result;
    return allsensors;
  }, function(err) {
    console.log(err);
  }).then(function(result) {
    var jsonContent = JSON.parse(result);
    var sensors = ['22','35','39']

    sensors.forEach(function(value){
      var sensor_name = jsonContent[value].name;
      var temperature = JSON.stringify(jsonContent[value].state.temperature);
      console.log(sensor_name + "," + temperature.substr(0,2) + "." + temperature.substr(2,4));
    });

    var temp_1 = JSON.stringify(jsonContent['22'].state.temperature);
    var floor_2 = temp_1.substr(0,2) + "." + temp_1.substr(2,4);
    var temp_2 = JSON.stringify(jsonContent['35'].state.temperature);
    var floor_1 = temp_2.substr(0,2) + "." + temp_2.substr(2,4);
    var temp_3 = JSON.stringify(jsonContent['39'].state.temperature);
    var floor_0 = temp_3.substr(0,2) + "." + temp_3.substr(2,4);

    var updatePromise = update_graph(process.env.thingspeak_url,process.env.thingspeak_key_write,floor_0,floor_1,floor_2);
    updatePromise.then(function(result) {
      return result;

    }, function(err) {
      console.log(err);
    }).then(function(result) {
      console.log(result);
    })
    })

}

main();
