var _ = require("underscore");
var getheaders = function (name,value,parent){
	var ret = "";
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
	switch(Object.prototype.toString.call(value)){
	case "[object Object]":
		for (var k in value){
			ret += getheaders(k,value[k],family);
		}
		break;
	case "[object Array]":
		for (var ix=0;ix < value.length; ix++){
			ret += getheaders(ix,value[ix],family);
		}
		break;
	default:
		ret += family + ",";
	}
	return ret;
};
var tocsv = function (row,heads){
	var ret = "", exec = "", val = "";
	for (var x in heads){
		exec = "row"+heads[x];
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
	if (ret.slice(-1)==",") ret = ret.substring(0, ret.length - 1);
	return ret;
};
if (process.argv.length==4){
	var json = "";
	var fs = require("fs");
	fs.readFile(process.argv[2],function(err,filedata){
		if (err){
			console.log("Error while opening file..",err);
			process.exit(1);
		}
		var headers = [];
		var json = JSON.parse(filedata);
		//var headers = getheaders("",json,"");
		for (var k in json.rows){
			var header = getheaders("",json.rows[k],"");
			if (header.slice(-1)==",") header = header.substring(0, header.length - 1);
			headers = _.uniq(headers.concat(header.split(",")));
			//headers = _.uniq(headers);
		}
		var data = headers.join(",")+"\n";;
		for (var k in json.rows){
			data += tocsv(json.rows[k],headers)+"\n";
		}
		fs.writeFile(process.argv[3],data,function(err){
			if (err){
				console.log("Error while writing file..",err);
				process.exit(1);
			}
		});
	});
}else{
	console.log("Usage : node json2csv.js <<input file>> <<output file>>");
}
