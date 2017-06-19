 module.exports = {
        template: require('./template.html'),
        data: function() {
            return {
                path: '/',
                files: [],
                info :{},
                pathArr  : []
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
                console.log("hello");
	            this.$http.get('https://api.github.com/repos/' + this.fullRepoUrl + '/contents' + this.path,
	                function(data) {
	                    this.files = data;
	                }
	            );
	        },
            getInfo:function(){
                this.$http.get('https://api.github.com/repos/' + this.fullRepoUrl ,
                    function(data){
                        this.info = data;
                        console.log(this.info.stargazers_count);
                    }
                );
            },
            changePath: function(path) {
                this.pathArr = path.split('/');
                this.pathArr.unshift(this.fullRepoUrl);
                console.log(path.split('/'));
                this.path = '/' + path;

                this.getFiles();
            },
            goBack: function() {
                this.path = this.path.split('/').slice(0, -1).join('/');
                if (this.path === '') this.path = '/';
                this.getFiles();
            },
            choosePath: function(index){
                console.log(index);
                this.path = this.pathArr.slice(1, index+1).join('/');
                this.pathArr = this.pathArr.slice(0, index+1);
                this.getFiles();

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
        }
    },
        created: function() {
            if (this.username && this.repo){
             this.getFiles();
             this.getInfo();
            }
            

        
        }
    };