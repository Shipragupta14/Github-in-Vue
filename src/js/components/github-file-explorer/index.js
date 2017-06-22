 module.exports = {
        template: require('./template.html'),
        data: function() {
            return {
                loading: false,
                path: '/',
                files: [],
                info :{},
                pathArr  : [],
                xhr : {},
                read:{},
                display: ""
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
                this.loading =true;
                var r = this;
                var string;
                var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
                this.$http.get('https://api.github.com/repos/' + this.fullRepoUrl + '/contents/README.md?ref=master' )
                .then(function(data){ 
                    r.read=data.data ;
                    string = r.read.content;
                    var markdownContent =Base64.decode(string);
                    var htmlContent = markdown.toHTML(markdownContent);
                    var toReplaceWith ="src=\"https://raw.githubusercontent.com/"+ r.fullRepoUrl + "/master/";
                    r.display = htmlContent.replace(/src="[^http]/g, toReplaceWith);
                    r.xhr={};
                    r.loading = false;   
                }).catch(function(err){
                    r.xhr=err;
                    r.info = {};
                    r.loading = false;   

                });
            },
            changePath: function(path) {
                this.pathArr = path.split('/');
                this.pathArr.unshift(this.fullRepoUrl);
                console.log(path.split('/'));
                this.path = '/' + path;

                this.getFiles();
                this.getRead();
            },
            goBack: function() {
                this.path = this.path.split('/').slice(0, -1).join('/');
                if (this.path === '') this.path = '/';
                this.getFiles();
                this.getRead();

            },
            choosePath: function(index){
                console.log(index);
                this.path = this.pathArr.slice(1, index+1).join('/');
                this.pathArr = this.pathArr.slice(0, index+1);
                this.getFiles();
                this.getRead();


            }
        
	    },
	     computed: {
	        fullRepoUrl: function() {
	            return this.username + '/' + this.repo;
	        },
	        sortedFiles: function() {
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
            this.getRead();
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

