


function ZUpload(obj){
	var zobj={
		url:obj.url,
		dom:obj.dom,
		success:obj.success
	};

	function bindEvent(){
		var nodeDom=document.querySelector(zobj.dom);
		nodeDom.addEventListener('change',function(e){
			if(obj.before){
				obj.before(zobj,function(){
					upload();	
				});
			
			}else{
				upload();
			}

			function upload(){
				if(!window.FileReader){
					return;
				}
				var reader=new FileReader();
				var startIndex=0;
				var file=nodeDom.files;
				var endIndex=file.length-1;
				var fileIndex=0;
				var fm=new FormData();
				var data_list=[];
				reader.onload=function(){
					//console.log(reader.result);

					var imgdata=reader.result.split(',')[1];
					imgdata=window.atob(imgdata);
					var ia = new Uint8Array(imgdata.length);
					for (var i = 0; i < imgdata.length; i++) {
					    ia[i] = imgdata.charCodeAt(i);
					};
					var blob=new Blob([ia], {type:"image/png"});
					var fm2=new FormData();
					fm2.append('file'+startIndex,blob);
					var xhr2=new XMLHttpRequest();
					var fileName=(new Date().getTime())+file[startIndex].name.substring(file[startIndex].name.lastIndexOf('.'));
					var fileSize=file[startIndex].size;
					xhr2.open('get','http://cs.chiefjee.com/api/DefaultApi/GetResult?FileName='+fileName+'&FileSize='+fileSize);
					xhr2.send({});
					xhr2.onload=function(data){
							if(this.status>=200 && this.status<400){
								var data=JSON.parse(this.response);
								console.log(data);
								zobj.url=data.Data;
								//zobj.success(data);
								postFile(fm2);

								//document.getElementById('img-box').appendChild('<img src="'+data.result+'"/>');
								//$('body').append('<img src="'+data.result+'"/>');
							}else{
								zobj.error(data);
							}
					}

					

					function postFile(_fm){
						var xhr=new XMLHttpRequest();
						xhr.open('post',zobj.url);
						xhr.send(_fm);
						xhr.onload=function(data){
							if(this.status>=200 && this.status<400){
								console.log('上传成功');
								var data=JSON.parse(this.response);
								data_list.push(data);
								if(fileIndex>=endIndex){
									zobj.success(data_list);
								}
								fileIndex++;
								//document.getElementById('img-box').appendChild('<img src="'+data.result+'"/>');
								//$('body').append('<img src="'+data.result+'"/>');
							}else{
								zobj.error(data);
							}
						}
					}

					if(startIndex!=endIndex){
						startIndex++;
						//console.log(file[startIndex]);
						reader.readAsDataURL(file[startIndex]);
						return;
					}
					console.log('全部读取完毕');

				}
				//for(var i=0;i<file.length;i++){
				if(file.length>0){
					reader.readAsDataURL(file[0]);
				}

				//}
			}
		});
	}
	bindEvent();

	return zobj;
}
