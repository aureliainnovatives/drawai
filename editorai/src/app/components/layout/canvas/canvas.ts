
// Square
const square = new fabric.Rect({
    left: 100,
    top: 100,
    fill: '',
    stroke: 'black',
    strokeWidth: 1,
    width: 50, // Adjust width and height to make it a square
    height: 50, // Adjust width and height to make it a square
  });
  
  this.canvas.add(square);
  
  //Roundedsquare
  const roundedSquare = new fabric.Rect({
    left: 100,
    top: 100,
    fill: '',
    stroke: 'black',
    strokeWidth: 1,
    width: 50,
    height: 50,
    rx: 10, // Adjust the value to control the roundness of corners
    ry: 10, // Adjust the value to control the roundness of corners
  });
  this.canvas.add(roundedSquare);
  
    //FilledTriangle
     const FilledTriangle = new fabric.Rect({ 
        left: 100,
        top: 100,
        fill: 'black',
        stroke :'black',
        strokeWidth :1,
        width: 20,
        height: 20,
       
    }); 
       this.canvas.add(rect);
  
   // triangle
     const triangle = new fabric.Rect({ 
        left: 100,
        top: 100,
        fill: '',
        stroke :'black',
        strokeWidth :1,
        width: 20,
        height: 20,
       
    }); 
       this.canvas.add(rect);
  
    //Roundtriangle
  //Define the points for the triangle
  const points = [
    { x: 0, y: 20 },   // Bottom left corner
    { x: 20, y: 0 },   // Top corner
    { x: 40, y: 20 },  // Bottom right corner
  ];
  
  //Circle
  const circle = new fabric.Circle({
      left: 100,
      top: 100,
      fill: '', // You can specify a color for the fill if needed
      stroke: 'black',
      strokeWidth: 1,
      radius: 10, // Specify the radius of the circle
    });
    this.canvas.add(circle);
  
   
    const circle2 = new fabric.Circle({
      left: 100,
      top: 100,
      fill: 'black', // You can specify a color for the fill if needed
      stroke: 'black',
      strokeWidth: 1,
      radius: 10, // Specify the radius of the circle
    });
    this.canvas.add(circle2);
   
  
    const triangle2 = new fabric.Triangle({
      left: 100,
      top: 100,
      fill: '', // You can specify a color for the fill if needed
      stroke: 'black',
      strokeWidth: 1,
      width: 20, // Specify the width of the triangle's base
      height: 20, // Specify the height of the triangle
    });
    
    // // Add the triangle to the canvas
    this.canvas.add(triangle2);
  
    const triangle3 = new fabric.Triangle({
      left: 100,
      top: 100,
      fill: 'black', // You can specify a color for the fill if needed
      stroke: 'black',
      strokeWidth: 1,
      width: 20, // Specify the width of the triangle's base
      height: 20, // Specify the height of the triangle
    });
    
    // // Add the triangle to the canvas
    this.canvas.add(triangle3);
  
  //   // Define the points for the star
  const starPoints1 = [
    { x: 0, y: -50 },
    { x: 15, y: -15 },
    { x: 50, y: 0 },
    { x: 15, y: 15 },
    { x: 0, y: 50 },
    { x: -15, y: 15 },
    { x: -50, y: 0 },
    { x: -15, y: -15 },
  ];
  
  // Create a star polygon
  const star1= new fabric.Polygon(starPoints1, {
    left: 100,
    top: 100,
    fill: '', // You can specify a color for the fill if needed
    stroke: 'black',
    strokeWidth: 1,
  });
  
  // // Add the star to the canvas
  this.canvas.add(star1);
  
  const star2 = new fabric.Polygon([
    { x: 0, y: -50 },
    { x: 15, y: -15 },
    { x: 50, y: 0 },
    { x: 15, y: 15 },
    { x: 0, y: 50 },
    { x: -15, y: 15 },
    { x: -50, y: 0 },
    { x: -15, y: -15 },
    { x: 0, y: -50 } // closing point to complete the star
  ], {
    left: 100,
    top: 100,
    fill: 'yellow', // fill color
    stroke: 'black',
    strokeWidth: 1,
    scaleX: 0.3, // Adjust scale as needed
    scaleY: 0.3, // Adjust scale as needed
  });
  
  this.canvas.add(star2);
  
  
  
     
      
  
      const starRadius = 50;
      const innerRadius = 20;
      const numberOfPoints = 5;
      const angleIncrement = (2 * Math.PI) / (numberOfPoints * 2);
  
      const outerStarPoints = [];
      const innerStarPoints = [];
  
      for (let i = 0; i < numberOfPoints * 2; i++) {
        const radius = i % 2 === 0 ? starRadius : innerRadius;
        const angle = i * angleIncrement - Math.PI / 2;
  
        const point = {
          x: starRadius + radius * Math.cos(angle),
          y: starRadius + radius * Math.sin(angle),
          stroke: 'black',
          strokeWidth: 2,
        };
  
        if (i <= numberOfPoints) {
          innerStarPoints.push(point);
        } else {
          outerStarPoints.push(point);
        }
      }
  
  
      const starInner = new fabric.Polygon(innerStarPoints, {
        fill: 'black',
        stroke: 'black',
        strokeWidth: 3,
        left: 250,
        top: 250,
      });
  
      this.canvas.add(starInner);
  




      const svgUrl = '/assets/Svgs/halfstar.svg';
  
      fabric.loadSVGFromURL(svgUrl, (objects, options) => {
        const [halfFilledStar] = objects as fabric.Object[];
  
        // Adjust the scale to make the star smaller
        const scaleRatio = 4.0; // Change this value as needed
        halfFilledStar.scaleX = scaleRatio;
        halfFilledStar.scaleY = scaleRatio;
  
        halfFilledStar.set({
          left: this.canvas?.width ? this.canvas.width / 2 : 0,
          top: this.canvas?.height ? this.canvas.height / 2 : 0,
          originX: 'center',
          originY: 'center',
        });
  
        this.canvas?.add(halfFilledStar);
      })






    
      const hexagonPoints = [
        { x: 0, y: -15 },
        { x: 13.4, y: -7.5 },
        { x: 13.4, y: 7.5 },
        { x: 0, y: 15 },
        { x: -13.4, y: 7.5 },
        { x: -13.4, y: -7.5 }
    ];
    
    const hexagon1 = new fabric.Polygon(hexagonPoints, {
        left: 100,
        top: 100,
        fill: '',
        stroke: 'black',
        strokeWidth: 1
    });
    
    this.canvas.add(hexagon1);
   
  
      const hexagonPoints1 = [
        { x: 0, y: -15 },
        { x: 13.4, y: -7.5 },
        { x: 13.4, y: 7.5 },
        { x: 0, y: 15 },
        { x: -13.4, y: 7.5 },
        { x: -13.4, y: -7.5 }
    ];
    
    const hexagon2 = new fabric.Polygon(hexagonPoints, {
        left: 100,
        top: 100,
        fill: 'black',
        stroke: 'black',
        strokeWidth: 1
    });
    
    this.canvas.add(hexagon2);
  
  }



  addHalfFilledStar(): void {
    const starRadius = 50;
      const innerRadius = 20;
      const numberOfPoints = 5;
      const angleIncrement = (2 * Math.PI) / (numberOfPoints * 2);
  
      const outerStarPoints = [];
      const innerStarPoints = [];
  
      for (let i = 0; i < numberOfPoints * 2; i++) {
        const radius = i % 2 === 0 ? starRadius : innerRadius;
        const angle = i * angleIncrement - Math.PI / 2;
  
        const point = {
          x: starRadius + radius * Math.cos(angle),
          y: starRadius + radius * Math.sin(angle),
  stroke: 'black',
          strokeWidth: 2,
        };
  
        if (i <= numberOfPoints) {
          innerStarPoints.push(point);
        } else {
          outerStarPoints.push(point);
        }
      }
      const starInner = new fabric.Polygon(innerStarPoints, {
        fill: '',
        stroke: 'black',
        strokeWidth: 3,
        left: 250,
        top: 250,
      });
  
      this.canvas.add(starInner);
  }
  
  addSevenStar(): void {
  const starRadius = 50;
      const innerRadius = 20;
      const numberOfPoints = 7;
      const angleIncrement = (2 * Math.PI) / numberOfPoints;
  
      const starPoints = [];
  
      for (let i = 0; i < numberOfPoints * 2; i++) {
        const radius = i % 2 === 0 ? starRadius : innerRadius;
        const angle = i * angleIncrement - Math.PI / 2;
  
        const point = {
          x: starRadius + radius * Math.cos(angle),
          y: starRadius + radius * Math.sin(angle),
        };
  
        starPoints.push(point);
      }
  
      const star = new fabric.Polygon(starPoints, {
        fill: '',
        stroke :'black',
        strokeWidth: 3,
        left: 250,
        top: 250,
      });
  
      this.canvas.add(star);
    }

    
    addSevenfillStar(): void {
      //filled seven star
      const starRadius = 50;
      const innerRadius = 20;
      const numberOfPoints = 7;
      const angleIncrement = (2 * Math.PI) / numberOfPoints;
  
      const starPoints3 = [];
  
      for (let i = 0; i < numberOfPoints * 2; i++) {
        const radius = i % 2 === 0 ? starRadius : innerRadius;
        const angle = i * angleIncrement - Math.PI / 2;
  
        const point = {
          x: starRadius + radius * Math.cos(angle),
          y: starRadius + radius * Math.sin(angle),
        };
  
        starPoints3.push(point);
      }
  
      const star4 = new fabric.Polygon(starPoints3, {
        fill: 'blue',
        left: 250,
        top: 250,
      });
  
      this.canvas.add(star4);
    
    }
  
    addfiveStar(): void {
      const starRadius = 50;
      const innerRadius = 20;
      const numberOfPoints = 5;
      const angleIncrement = (2 * Math.PI) / (numberOfPoints * 2);
  
      const starPoints = [];
  
      for (let i = 0; i < numberOfPoints * 2; i++) {
        const radius = i % 2 === 0 ? starRadius : innerRadius;
        const angle = i * angleIncrement - Math.PI / 2;
  
        const point = {
          x: starRadius + radius * Math.cos(angle),
          y: starRadius + radius * Math.sin(angle),
          stroke: 'blue',
          strokeWidth: 2,
        };
  
        starPoints.push(point);
      }
  
      const star = new fabric.Polygon(starPoints, {
        fill: '',
        stroke : 'black',
        strokeWidth: 2,
  
        left: 250,
        top: 250,
      });
  
      this.canvas.add(star);
    }
    addfivefillStar(): void {
      const starRadius = 50;
      const innerRadius = 20;
      const numberOfPoints = 5;
      const angleIncrement = (2 * Math.PI) / (numberOfPoints * 2);
  
      const starPoints = [];
  
      for (let i = 0; i < numberOfPoints * 2; i++) {
        const radius = i % 2 === 0 ? starRadius : innerRadius;
        const angle = i * angleIncrement - Math.PI / 2;
  
        const point = {
          x: starRadius + radius * Math.cos(angle),
          y: starRadius + radius * Math.sin(angle),
          stroke: 'blue',
          strokeWidth: 2,
        };
  
        starPoints.push(point);
      }
  
      const star = new fabric.Polygon(starPoints, {
        fill: 'black',
        stroke : 'black',
        strokeWidth: 2,
        left: 250,
        top: 250,
      });
  
      this.canvas.add(star);
    }
  