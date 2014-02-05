var _ = require("underscore");
var getheaders = function (name,value,parent){
	var ret = ""
	if (typeof name == "number"){
		name = "[" + name + "]";
        }else{
		if (name) name = "['" + name + "']";
        }
        var family = "";
	if (parent){
		family = parent + name;
        }else{
		family = name+"";
        }
        switch(Object.prototype.toString.call(value.class)){
          case "[object Object]":
            for (var k in value){
              ret = ret + getheders(k,value[k],family);
            }
	  break;
          case "[object Array]":
            for (var ix=0;ix < value.length; ix++){
              ret = ret + getheders(ix,value[ix],family);
            }
          break;
          default:
            ret = ret + family + ",";
          break;
        }
	return ret;
};
var tocsv = function (row,heads){
	var ret = "", exec = "", val = "";
        for (x in heads){
          exec = "row"+x;
          val = "";
          try {
            val = eval(exec);
            if (typeof val == "string"){
              val = '"' + val.replace('"','""') + '"';
            }
          }catch (err){
            console.log("error : ",err);
          }
          ret += val+",";
        }
	return ret;
};
if (process.argv.length==3){
  var json = "";
  var fs = require("fs");
  fs.readFile(process.argv[1],function(err,filedata){
    if (err){
      console.log("Error while opening file..",err);
      process.exit(1);
    }
    var headers = [];
    var json = JSON.parse(filedata);
    for (var k in json){
      header = getheaders("",json[k],"");
      if (header.slice(-1)==",") header = header.substring(0, header.length - 1);
      headers = _.uniq((headers + header).split(","));
    }
    var data = headers.join(",");
    for (var k in json){
      data += tocsv(data,headers);
    }
    fs.writeFile(process.argv[2],data,function(err){
      if (err){
        console.log("Error while writing file..",err);
        process.exit(1);
      }
    });
  });
}else{
  console.log("Usage : node json2csv.js <<input file>> <<output file>>");
}
