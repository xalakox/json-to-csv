require 'rubygems'
require 'json'

def getheaders(name,value,parent)
	name = name.to_s
	parent = parent.to_s
	ret = ""
	if value.class.to_s == "Hash"
		value.each do |k, v| 
			family = name
			family = parent + "['" + name + "']" if parent!=""
			ret = ret + getheaders(k,v,family)
		end
	elsif value.class.to_s == "Array"
		value.each_index do |i|
			family = name
			family = parent + name if parent!=""
			ret = ret + getheaders("["+i.to_s+"]",value[i],family)
		end
		
	elsif value.class.to_s == "Fixnum"
		ret = ret + parent + "["+ name + "],"
	elsif parent!=""
		ret = ret +  parent + "['" + name + "'],"
	else
		ret = ret + "['"+name + "'],"
	end
	return ret
end

def tocsv(row,heads)
	ret = ""
	heads.each do |h|
		exec = "row"+h
		begin
			ret += eval(exec)
		rescue Exception => exc
			ret += ""
		end
		ret +=","
	end
	return ret
end

				# ret = '';
				# for (var h in heads){
				# 	prop = heads[h].toString().replace(/\\[/gi,\"'][\");
				# 	prop = \"['\"+prop.replace(/\\./gi,\"']['\");
				# 	if (prop.charAt(prop.length-1)!=']') prop = prop+\"']\";
				# 	cmd = 'therow'+prop;
				# 	try{
				# 		valor = eval(cmd);
				# 		valor = valor.toString().replace(/,/gi,' ');
				# 		valor = valor.toString().replace(/(\\r\\n|\\n|\\r)/gm,'');
				# 	}
				# 	catch(er){
				# 		valor = '';
				# 	}
				# 	ret = ret + valor + ',';
				# }
				# return ret;


if ARGV[0] && ARGV[0] != "" && ARGV[1] && ARGV[1] != ""
	json = ""
	file = File.open(ARGV[0], 'r')
	json =  JSON.parse(file.readlines.to_s)
	headers = []
	json.each do |data|
		header = getheaders("",data,"")
		header = header[0..-2] if header[-1,1] == ","
		headers = (headers + header.split(",")).uniq
	end
	puts headers.inspect
	json.each do |data|
		puts tocsv(data,headers)
		exit 1
	end

else
	puts "Usage : json2csv <<input file>> <<output file>>"
end


