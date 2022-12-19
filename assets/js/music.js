const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAY_MUSIC_STORAGE = 'NHATTAN'

const title = $(".title")
const cd = $('.cdImg')
const audio = $('#audio')
const playlist = $('.playlist')
const cdE = $('.cd')
const playBtn = $('.play')
const wraper = $('.wraper')
const progress = $('#progress')
const nextBtn = $('.next')
const prevBtn = $('.back')
const author = $('.status')
const randomBtn = $('.rand')
const repeatBtn = $('.repeat') 



const $app = {
    currentSongIndex: 0,
    isRandom: false,
    isPlaying: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAY_MUSIC_STORAGE)) || {},
    songs: [
        {
        name: 'Muốn thư giãn cơ',
        singer:'Không có Chi',
        path:'./assets/song/1.mp3',
        image:'./assets/img/1.png'
    },
    {
        name: 'Thở bún thì',
        singer: 'Không có chi!',
        path: './assets/song/2.mp3',
        image: './assets/img/2.png'
    },
    {
        name: 'Thiền có hướng dẫn',
        singer:'Không có chi',
        path:'./assets/song/3.mp3',
        image:'./assets/img/3.png'
    }
    ],
    setConfig: function(key,value) {
        this.config[key] = value;   
        localStorage.setItem(PLAY_MUSIC_STORAGE, JSON.stringify(this.config))
    },
    render: function (){
        const htmls = this.songs.map((song, index) =>{
            return `
            <div class="song-item ${index == this.currentSongIndex ? 'active': ''}" data-index="${index}">
                <img src="${song.image}" alt="song">
                <div class="info">
                    <div class="name">${song.name}</div>
                    <div class="author">${song.singer}</div>
                    
                </div>
                <button class="more"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties : function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
              return this.songs[this.currentSongIndex]}
        })
    },
    loadCurrentSong : function(){
        author.textContent = this.currentSong.singer
        title.textContent  = this.currentSong.name
        cd.src = this.currentSong.image
        audio.src = this.currentSong.path
        this.setConfig('currentSongIndex', Number(this.currentSongIndex))
        
    }
    ,
    handleEvents : function(){
        _this = this
        const cdWidth = cd.offsetWidth
        const cdHeight = cd.offsetHeight

        const cdAnimate = cd.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })

        cdAnimate.pause()

        document.onscroll = function(){
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop
            const newCdHeight = cdHeight - scrollTop
            

            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0
            cd.style.height = newCdHeight > 0 ? newCdHeight +'px' : 0
            
            cd.style.opacity = newCdWidth / cdWidth

            if(newCdWidth <= 0){
                cdE.style.display = 'none'
            }else{
                cdE.style.display = 'block'
            }  
        }
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }

            audio.onplay = function(){
                _this.isPlaying = true
                wraper.classList.add('playing')
                cdAnimate.play()
            }

            audio.onpause = function(){
                _this.isPlaying = false
                wraper.classList.remove('playing')
                cdAnimate.pause()
            }

        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value 
            audio.currentTime = seekTime
        }

        playlist.onclick = function(e){
            const songNode = e.target.closest('.song-item:not(.active)')
            
            if(songNode || e.target.closest('.more')){
                if(songNode){
                    _this.currentSongIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }
        }

        

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            wraper.classList.add('playing')
            _this.render()
            _this.scrollToView()

        }

        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToView()
        }

        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
    },
    scrollToView: function(){
        setTimeout(()=>{
            $('.song-item.active').scrollIntoView({
                behavior:'smooth',
                block: 'center',
            })
        },300)
    }
    ,
    nextSong : function(){
        this.currentSongIndex++
        if(this.currentSongIndex >= this.songs.length){
            this.currentSongIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong : function(){
        this.currentSongIndex--
        if(this.currentSongIndex < 0){
            this.currentSongIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    }
    ,
    playRandomSong : function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(this.currentSongIndex === newIndex)

        this.currentSongIndex = newIndex
        this.loadCurrentSong()
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom 
        this.isRepeat = this.config.isRepeat 
        this.currentSongIndex = this.config.currentSongIndex
    }
    ,
    start: function (){
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()


        this.loadCurrentSong()
        this.render()

        randomBtn.classList.toggle('active', this.isRepeat)
        repeatBtn.classList.toggle('active', this.isRandom)
        
    }
}
$app.start()