let inputImg, currentImg, inputCanvas, output, statusMsg, pix2pix, transferBtn, modelReady = false, isTransfering = false;         
               
        let annotationToggle = true;
        
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        
        
        function setup()
        {   
            output = select('#output');
            statusMsg = select('#status');

            transferBtn = select('#transferBtn');
            pixelDensity(1);

            pix2pix = ml5.pix2pix('models/model-8800.meta', modelLoaded);

        }

        function draw(video, context, width, height)
        {
            
            var image, data, i, r1, g1, b1;
            
            image = context.getImageData(0,0,width,height);
            data = image.data;
            
            context.beginPath();    
            context.fillStyle = "rgb(0,0,0)";
            context.fillRect(0, 0, 512, 512);
        }
        
        function modelLoaded() { 
            modelReady = true;
            transfer();
            transferBtn.mousePressed(function(){ 

                var inputData = context.toDataURL();
                inputData.class('border-box').parent('input');
            
                inputImg = loadImage(inputData, drawImage);
                currentImg = inputImg;

                transfer() 
            });   
        }
        
        function drawImage() {
            image(inputImg,0,0, 256, 256);
        }
        
        

        function transfer() {
            isTransfering = true;
            const canvasElement = select('canvas').elt;
            // Apply pix2pix transformation
            pix2pix.transfer(canvasElement, function(err, result) {
            if (err) {
                console.log(err);
            }
            if (result && result.src) {
                isTransfering = false;    
                output.elt.src = result.src;
                }
            });
        }
