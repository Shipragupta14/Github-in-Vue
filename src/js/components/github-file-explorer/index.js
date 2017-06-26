 module.exports = {
        template: require('./template.html'),
        data: function() {
            return {
                loading: false,
                readme: true,
                showFile: false,
                path: '/',
                files: [],
                info :{},
                pathArr  : [],
                xhr : {},
                read:{},
                display: "",
                ext: "",
                names:[],
                fileName: "",
                noReadme: false,
                types: {
                    "js":  "javascript",
                    "java": "java",
                    "py" : "python",
                    "md" : "",
                    "json":""

                }
                
            };
        },

        props: {
            username: {
                type: String,
                required: true
            },
            repo: {
                type: String,
                required: true  
            }
        },

        methods: {
	        getFiles: function() {
                this.loading =true;
            
                console.log("hello");
                var vm = this;
	            this.$http.get('https://api.github.com/repos/' + this.fullRepoUrl + '/contents' + this.path)
                .then(function(data){ 
                    
                    vm.files=data.data ;
                    vm.xhr={};

                    vm.loading = false;   
                }).catch(function(err){
                    vm.xhr=err;
                    vm.info = {};
                    vm.loading = false;   

                });

	        },
            getInfo:function(){
                var v = this;
                this.$http.get('https://api.github.com/repos/' + this.fullRepoUrl) 
                .then(function(data){
                        v.info = data.data;
                        
                    }).catch(function(err){
                    v.xhr=err;
                
                });
                    
                
            },

            getRead: function(){
                var r = this;
                this.$http.get('https://raw.githubusercontent.com/'+ this.fullRepoUrl +'/master/README.md' )
                .then(function(data){ 
                    
                    r.read=data.data ;
                    var htmlContent = marked(r.read, { sanitize: true , gfm : true});;
                    var toReplaceWith ="src=\"https://raw.githubusercontent.com/"+ r.fullRepoUrl + "/master/";
                    r.display = htmlContent.replace(/src="[^http]/g, toReplaceWith);
                   // r.xhr={}; 
                    r.noReadme = false;

                }).catch(function(err){
                    r.xhr.noreadme=err;
                    r.info = {}; 
                    r.noReadme = true;
                    r.readme=false;
                });
            },
            changePath: function(path) {
                this.readme = false;
               
                this.pathArr = path.split('/');
                this.pathArr.unshift(this.fullRepoUrl);
                console.log(path.split('/'));
                this.path = '/' + path;
                 
                this.getFiles();
                if(this.path === '/'){
                    this.readme = true ;
                    this.showFile = false;
                    this.getRead();

                }
            },
            goBack: function() {
                this.readme = false;
                this.showFile = false;
                this.path = this.path.split('/').slice(0, -1).join('/');
                this.getFiles();
                if (this.path === ''){
                 this.path = '/'
                 if(!this.noReadme){
                    this.getRead();
                    this.readme = true
                 }
                }
            },
            choosePath: function(index){
                console.log(index);
                this.path = this.pathArr.slice(1, index+1).join('/');
                this.pathArr = this.pathArr.slice(0, index+1);
                this.getFiles();
                this.getRead();


            },
            chooseFile: function(name){

                if (name) {
                    this.loading= true;
                   // console.log(name);
                 //   console.log(this.names);
                    var el = this;
                    this.fileName = name.split('/').slice(-1);
                    this.types = name.split(".").slice(-1);
                   // console.log(this.fileName);
                var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
                    var strin;
                    console.log(this.types);
                    var e1 = this 
                if(this.types=="json"){
                    
                    this.$http.get('https://api.github.com/repos/'+ this.fullRepoUrl +'/contents/'+ name+ '?ref=master' )
                    .then(function(data){
                        console.log("3333333333333333333333333333333");
                        el.readme = false;
                    el.showFile= true;
                    el.loading = false;
                    strin = data.data.content;
                    el.ext = Base64.decode(strin);
                    console.log(this.ext);
                        $(document).ready(function() {
                  $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                    hljs.lineNumbersBlock(block);
                  });
                });
 
                    })
                }
                else if(this.types=="md") {
                    this.$http.get('https://raw.githubusercontent.com/'+ this.fullRepoUrl +'/master/'+ name )
                .then(function(data){
                    el.readme = true;
                    el.showFile= false;
                    el.loading = false;
                    var htmlContent = marked(data.data, { sanitize: true , gfm : true});;
                    var toReplaceWith ="src=\"https://raw.githubusercontent.com/"+ el.fullRepoUrl + "/master/";
                    el.display = htmlContent.replace(/src="[^http]/g, toReplaceWith);

                    //el.types = "";
                //     $(document).ready(function() {
                //   $('pre code').each(function(i, block) {
                //     hljs.highlightBlock(block);
                //   });
                // });

                });
            }
                else{ 
                this.$http.get('https://raw.githubusercontent.com/'+ this.fullRepoUrl +'/master/'+ name )
                .then(function(data){
                    el.readme = false;
                    el.showFile= true;
                    el.loading = false;
                // console.log(name.split(".").slice(-1));
                // console.log(e.types.slice(0));
                  // console.log(data.data);
                   el.types = name.split(".").slice(-1);
                   if (el.types == "html") {
                    el.ext = data.data.replace(/</g, '&lt');
                    el.ext = el.ext.replace(/>/g, '&gt');
                   }else{
                    el.ext = data.data;
                    console.log(el.ext);
                   }
                    
                $(document).ready(function() {
                  $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                    hljs.lineNumbersBlock(block);
                  });
                });

                })
                
                }
            }
            }
        
	    },

	     computed: {
	        fullRepoUrl: function() {
	            return this.username + '/' + this.repo;
	        },
	        sortedFiles: function() {
                if (this.path === '/') {
                    if(!this.noReadme)
                    this.readme = true;
                    else{
                        this.readme= false;
                    }
                    this.showFile= false;
                }

        		return this.files.slice(0).sort(function(a, b) {  
            		if (a.type !== b.type) {
                		if (a.type === 'dir') {
                    	return -1;
                		} else {
                    	return 1;
                		}
            		} else {
                		if (a.name < b.name) {
                    	return -1;
                		} else {
                    	return 1;
                		}
            		}
        		});
    		}


    	},
       watch: {
        repo: function(newVal, oldVal) {
            this.path = '/';
            this.getFiles();
            this.getInfo();
            console.log("afterInfo")
            this.getRead();
            console.log("afterRead")
            this.chooseFile();
        }
    },
        created: function() {
            if (this.username && this.repo){
             this.getFiles();
             this.getInfo();
             this.getRead();
            } 
        }
    };

