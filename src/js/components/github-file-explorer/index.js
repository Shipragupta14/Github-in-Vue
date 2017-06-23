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
                    console.log(name);
                this.$http.get('https://raw.githubusercontent.com/'+ this.fullRepoUrl +'/master/'+ name )
                
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

