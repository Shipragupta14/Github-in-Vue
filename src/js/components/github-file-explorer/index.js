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
                types: {
                    "js":  "javascript",
                    "java": "java",
                    "py" : "python",
                    "md" : ""

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
                    r.xhr={}; 

                }).catch(function(err){
                    r.xhr=err;
                    r.info = {}; 

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
                if (this.path === ''){
                 this.path = '/'
                this.getFiles();
                this.getRead();
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
                    console.log(name);
                 //   console.log(this.names);
                    var e = this;
                    var strin;
                    this.fileName = name.split('/').slice(-1);
                    console.log(this.fileName)
                this.$http.get('https://raw.githubusercontent.com/'+ this.fullRepoUrl +'/master/'+ name )
                .then(function(data){
                    e.readme = false;
                    e.showFile= true;
                 console.log(name.split(".").slice(-1));
                 e.types = name.split(".").slice(-1);
                 console.log(e.types.slice(0));
                    console.log(data);
                    e.ext = data.data;
                    //console.log(e.ext);
                    $(document).ready(function() {
                  $('pre code').each(function(i, block) {
                    hljs.highlightBlock(block);
                    hljs.lineNumbersBlock(block);
                  });
                });
                //console.log(e.display);


                })
                //  this.$http.get('https://raw.githubusercontent.com/'+ this.fullRepoUrl +'/master/'+ name )
                // .then(function(data){
                //     console.log(data);
                //     e.ext = data.data;
                //     document.getElementById("demo1").innerHTML = eval(data.data);

                // })


                
                }
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

