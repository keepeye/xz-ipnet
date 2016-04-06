/**
 * Created by admin on 16/3/31.
 */
"use strict"
var fs = require('fs');
var bufferpack = require('bufferpack');
var IP = require('ip');

//ip字典
function IpNet(index,offset,content){
  this.index = index;
  this.offset = offset;
  this.content = content;
}

//查询ip
IpNet.prototype.find = function(ip){
  if (!ip) {
    throw new Error('请传入合法ip');
  }
  var ipdot = ip.split('.');
  if (ipdot[0] < 0 || ipdot[0] > 255 || ipdot.length != 4)
  {
    return null;
  }
  var ip2 = bufferpack.pack('L',[IP.toLong(ip)]);
  var tmp_offset = parseInt(ipdot[0]) * 4;
  var start = bufferpack.unpack('<L(len)',this.index.slice(tmp_offset,tmp_offset+4));
  var index_offset,index_length;
  var max_comp_len = this.offset['len'] - 1024 - 4;
  for (var s = start['len'] * 8 + 1024; s < max_comp_len; s += 8) {
    if (this.index.slice(s,s+4).compare(ip2) >= 0)
    {
      index_offset = bufferpack.unpack('<L(len)', Buffer.concat([this.index.slice(s+4,s+7),new Buffer([0x00])]));
      index_length = bufferpack.unpack('B(len)', this.index.slice(s+7,s+8));
      break;
    }
  }
  if (!index_offset) {
    return null;
  }
  var sk = this.offset.len+index_offset.len-1024;
  var area = this.content.slice(sk,sk+index_length.len).toString().split("\t");
  return area;
}

module.exports = function(dat){
  console.log('IP库初始化..');
  var content = fs.readFileSync(dat || __dirname + '/ip.dat');
  var offset = bufferpack.unpack('L(len)',content.slice(0,4));
  if (!offset.len || offset.len < 4) {
    throw new Error('无法解析的ip库');
  }
  var index = content.slice(4,4+offset.len-4);
  console.log('IP库初始化成功!');
  return new IpNet(index,offset,content);
};