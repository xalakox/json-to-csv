require 'rubygems'
require 'json'
def getheaders(name,value,parent)
	ret = ""
	if name.class.to_s == "Fixnum"
		name = "[" + name.to_s + "]"
	else
		name = "['" + name.to_s + "']" if name !=""
	end
	if parent!=""
		family = parent + name
	else
		family = name.to_s
	end
	case value.class.to_s
		when "Hash"
			value.each do |k, v| 
				ret = ret + getheaders(k,v,family)
			end
		when "Array"
			value.each_index do |i|
				ret = ret + getheaders(i,value[i],family)
			end
		else
			ret = ret + family + ","
	end
	return ret
end
def tocsv(row,heads)
	ret = ""
	heads.each do |h|
		exec = "row"+h
		val = ""
		begin
			val = eval(exec)
			if val.class.to_s == "String"
				val = '"' + val.sub('"','""') + '"'
			end
		rescue Exception => exc
			
		end
		ret += val.to_s+","
	end
	return ret
end
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
	end

else
	puts "Usage : json2csv <<input file>> <<output file>>"
end


