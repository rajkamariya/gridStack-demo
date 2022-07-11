import { unsupported } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import { GridItemHTMLElement, GridStack, GridStackNode, GridStackWidget } from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'gridstackDemo';
  private grid: GridStack;
  maxGridRow;
  maxGridColumn = 6;
  minGridRow = 1;
  minGridColumn = 1;
  cellHeight= 0;
  gridItems = [];
  gridFirstRowHeight;
  minElementHeight = 8;
  maxElementHeight;

  constructor(){
  }

  ngOnInit(){
    
    const gridLength =
          document.getElementsByClassName('grid-stack-item').length;

    this.maxGridRow = Math.ceil(gridLength / 2) * 12;
    this.cellHeight = document.getElementsByClassName('grid-stack')[0].clientHeight / this.maxGridRow;
    this.gridFirstRowHeight = this.maxGridRow/2;
    this.maxElementHeight = this.maxGridRow - this.minElementHeight;
    console.log(this.maxGridRow)
    this.grid = GridStack.init({
      cellHeight: this.cellHeight,
      maxRow: this.maxGridRow,
      minRow: 1,
      animate: true,
      column:6,
      resizable: { autoHide: true, handles: 'se, sw' },
    })
    this.resizeGrid();

    // this.grid.on('change', function(event: Event, items: GridStackNode[]) {
    //   items.forEach(function(item) {
    //     console.log(item)
    //   });
    // });
    
    this.gridItems = this.grid.getGridItems();
    console.log(this.gridItems[0])
    let s=this;
    // console.log(this.gridItems)
    // this.gridItems.forEach((grid)=>{
    //   console.log(grid.getElementsByClassName('ui-resizable-se'))
    //   grid.getElementsByClassName('ui-resizable-se')[0].addEventListener('mouseup', function(this){
    //     console.log(grid.clientHeight)
    //     let widgetHeight:any = `${grid.clientHeight}`;
    //     widgetHeight=widgetHeight.replace('px','');
    //     widgetHeight= widgetHeight * 1;
    //     console.log(grid)
    //     console.log(grid.gridstackNode.h, s.maxGridRow)
    //       s.newGrid(Math.floor(widgetHeight/s.cellHeight), grid)
    //   })
    // });
    this.addWidgetResizeHandle();
    this.grid.on('resize', (event: Event, el: GridItemHTMLElement)=>{
      console.log("RESIZE GRID")
      console.log(event)
      console.log(el);
      let widgetHeight:any = `${el.clientHeight}`;
      widgetHeight=widgetHeight.replace('px','');
      widgetHeight= widgetHeight * 1;
      s.resizeElement(Math.floor(widgetHeight/s.cellHeight), el)
    })

    this.grid.on('dragstop', function(event: Event, el: GridItemHTMLElement) {
      console.log("DRAGSTOP");
      console.log(el.gridstackNode.h)
      s.resizeElement(el.gridstackNode.h,el)
      // s.gridItems = s.grid.getGridItems();
      // for(let i=0;i<s.gridItems.length - 1;i++){
      //   for(let j=i+1;j<s.gridItems.length; j++){
      //     let temp;
      //     if(s.gridItems[i].gridstackNode.x > s.gridItems[j].gridstackNode.x || ((s.gridItems[i].gridstackNode.x === s.gridItems[j].gridstackNode.x) && (s.gridItems[i].gridstackNode.y > s.gridItems[j].gridstackNode.y)))
      //     {
      //       temp = s.gridItems[i];
      //       s.gridItems[i] =s.gridItems[j];
      //       s.gridItems[j]=temp;
      //     }
      //   }
      // }
      // s.grid.removeAll();
      // for (const widget of s.gridItems) {
      //   s.grid.addWidget(widget)
      // }
      // s.addWidgetResizeHandle();
      // s.resizeElement(s.gridFirstRowHeight)
      // s.resizeElement(el.gridstackNode.h,el)

    });
    console.log(this.gridItems)

    this.gridItems.forEach((grid)=>{
      let draggedElement;
      let elementY;
      let elementX;
      let elementH;
      let elementW;
      grid.addEventListener('drag', function(this){
        // console.log("DragDrop")
        let columnSize = document.getElementsByClassName('grid-stack')[0].clientWidth/6;
        
        // console.log("columnSize=",columnSize)
        // console.log(grid.gridstackNode);
        draggedElement = grid;
        let leftPostion :any = `${grid.style.left}`;
        leftPostion=leftPostion.replace('px','');
        leftPostion= leftPostion * 1;
        let topPostion :any = `${grid.style.top}`;
        topPostion=topPostion.replace('px','');
        topPostion= topPostion * 1;
        elementX = Math.round(topPostion/s.cellHeight)
        // console.log(elementX);
        if(elementX >-3 && elementX <3){
          elementX = 0;
        }else if(elementX > (s.gridFirstRowHeight-3) && elementX < (s.gridFirstRowHeight+3)){
          elementX = s.gridFirstRowHeight;
        }
        elementH = grid.gridstackNode.h;
        elementW = grid.gridstackNode.w;
        console.log(elementX);

        // console.log(s.cellHeight)
        // console.log(Math.round(topPostion/s.cellHeight))
        // console.log(document.getElementsByClassName('grid-stack')[0].clientHeight)
        // console.log(Math.round(leftPostion/columnSize))
        elementY = Math.round(leftPostion/columnSize)
        // if(grid.gridstackNode.h === this.maxGridRow){
        //   oneElement = undefined;
        // }else{
        //   oneElement = grid;        
        // }
      })
      grid.addEventListener('dragend', function(){
        console.log("DRAGEND")
        let oneElement;
        if(elementY >= 0){
          let swappableElement = [];
          let unSwappableElement = [];
          let isSwap=false;
          console.log('X=',elementY)
          console.log('W=',elementY+elementW)
          console.log('Y=',elementX)
          console.log('H=',elementH+elementX)
          console.log(draggedElement.gridstackNode.x < elementY)
          // if(draggedElement.gridstackNode.x < elementY){}
          s.gridItems.forEach((grid)=>{
            if(grid !== draggedElement){
              // if(grid.gridstackNode.y >= draggedElement.gridstackNode.y && grid.gridstackNode.h <= draggedElement.gridstackNode.h && grid.gridstackNode.x === elementY && draggedElement.gridstackNode.h === s.maxGridRow){
              //   swappableElement.push({element:grid, y:grid.gridstackNode.y, x:draggedElement.gridstackNode.x});
                
              //   isSwap = true;
              // }else 
              if(grid.gridstackNode.x === elementY && grid.gridstackNode.y === elementX && grid.gridstackNode.h === elementH){
                // console.log(elementY)
                // console.log(grid.gridstackNode.x)
                // console.log(elementX)
                // console.log(grid.gridstackNode.y)

                oneElement = grid;
                // console.log("DDF")
              } 
              else if(grid.gridstackNode.x>= elementY 
                && (grid.gridstackNode.x+grid.gridstackNode.w)<= (elementY+elementW) 
                && grid.gridstackNode.y >= elementX 
                && (grid.gridstackNode.y+grid.gridstackNode.h)<= (elementX+elementH)){
                  console.log("GRIDX",grid.gridstackNode.x)
                  console.log("DRAGX",draggedElement.gridstackNode.x)
                  let swapValue;
                  if(grid.gridstackNode.x < draggedElement.gridstackNode.x){
                    // if((draggedElement.gridstackNode.x - grid.gridstackNode.x) > (draggedElement.gridstackNode.w)){
                    if((grid.gridstackNode.x % 2) != 0){
                      swapValue = (draggedElement.gridstackNode.x+(draggedElement.gridstackNode.x - grid.gridstackNode.x));
                      console.log("1SWAP=",(draggedElement.gridstackNode.x+(draggedElement.gridstackNode.x - grid.gridstackNode.x)))
                    }else{
                      swapValue = (draggedElement.gridstackNode.x);
                      console.log("2SWAP=",(draggedElement.gridstackNode.x))
                    }
                  }else{
                    if((grid.gridstackNode.x % 2) != 0){
                      if(draggedElement.gridstackNode.x === 0){
                        swapValue = (grid.gridstackNode.x-elementY);  
                      }else{
                        swapValue = (grid.gridstackNode.x-draggedElement.gridstackNode.x);
                      }
                      console.log("R1SWAP=",((grid.gridstackNode.x-draggedElement.gridstackNode.x)))
                    }else{
                      swapValue = (draggedElement.gridstackNode.x);
                      console.log("R2SWAP=",(draggedElement.gridstackNode.x))
                    } 
                  }
                  // if(grid.gridstackNode.x > draggedElement.gridstackNode.x){
                  //   console.log("Swap Position=",(elementY-elementW))
                  // }else{
                  //   console.log("Swap Position=",draggedElement.gridstackNode.x+elementY)
                  // } 
                  // if(grid.gridstackNode.x === elementY){
                    swappableElement.push({element:grid, y:grid.gridstackNode.y, x:swapValue, h:grid.gridstackNode.h,w:grid.gridstackNode.w});
                  // }else{
                  //   swappableElement.push({element:grid, y:grid.gridstackNode.y, x:draggedElement.gridstackNode.x+1});
                  // }
                  isSwap = true;
              }
              else{
                unSwappableElement.push({element:grid, y:grid.gridstackNode.y, x:grid.gridstackNode.x,h:grid.gridstackNode.h,w:grid.gridstackNode.w});
              }
             
            }
            
          })
          console.log(swappableElement)
          console.log(oneElement)
          if(swappableElement.length == 1 && draggedElement.gridstackNode.h === swappableElement[0].h && draggedElement.gridstackNode.w === swappableElement[0].w){
            oneElement = swappableElement[0].element;
          }
          if(oneElement){
            let dragX = draggedElement.gridstackNode.x;
            let dragY = draggedElement.gridstackNode.y;
            let oneElementX = oneElement.gridstackNode.x;
            let oneElementY = oneElement.gridstackNode.y; 
            console.log(oneElement.gridstackNode.x)
            console.log(oneElement.gridstackNode.y)
            // s.grid.update(draggedElement, {
            //   x:oneElementX,
            //   y:oneElementY
            // })
            // console.log(s.grid.getGridItems())
            console.log(dragX)
            if(dragX < oneElementX){
            swappableElement.push({element:oneElement,x:dragX,y:dragY,h:draggedElement.gridstackNode.h,w:draggedElement.gridstackNode.w})
            swappableElement.push({element:draggedElement,x:oneElementX,y:oneElementY,h:oneElement.gridstackNode.h,w:oneElement.gridstackNode.w})
            }else{
              swappableElement.push({element:draggedElement,x:oneElementX,y:oneElementY,h:oneElement.gridstackNode.h,w:oneElement.gridstackNode.w})

              swappableElement.push({element:oneElement,x:dragX,y:dragY,h:draggedElement.gridstackNode.h,w:draggedElement.gridstackNode.w})
            }// s.grid.update(oneElement, {
            //   x:dragX,
            //   y:dragY
            // })
            // s.grid.update(draggedElement, {
            //   x:oneElementX,
            //   y:oneElementY
            // })
          }
          console.log(swappableElement);
          console.log(unSwappableElement)
          //Check height of swappable and draggable element;
          let totalHeight = 0;
          let totalWidth = 0;
          //Sort
          console.log(swappableElement[0])
          for(let i=0;i<swappableElement.length - 1;i++){
            for(let j=i+1;j<swappableElement.length; j++){
              let temp;
              if(swappableElement[i].x > swappableElement[j].x || ((swappableElement[i].x === swappableElement[j].x) ))
              {
                temp = swappableElement[i];
                swappableElement[i] =swappableElement[j];
                swappableElement[j]=temp;
              }
            }
          }
          let firstRowElement = false;
          let secondRowElement = false;
          for(let i=0;i<swappableElement.length;i++){
            if(!firstRowElement && swappableElement[i].y === 0){
              totalHeight = totalHeight + swappableElement[i].h;
              firstRowElement = true;
            }
            if(!secondRowElement && swappableElement[i].y !== 0){
              totalHeight = totalHeight + swappableElement[i].h;
              secondRowElement = true;
            }
            
            // totalHeight = totalHeight + swappableElement[i].element.gridstackNode.h;
            // totalWidth = totalWidth + swappableElement[i].element.gridstackNode.w
          }

          
          let swappable = false;
          if(draggedElement.gridstackNode.h === totalHeight){
            swappable = true;
          }
          if(totalHeight <= draggedElement.gridstackNode.h && !secondRowElement){
            swappable = true;
          }
          if(swappableElement.length === 1 && totalHeight < draggedElement.gridstackNode.h && swappableElement[0].element.gridstackNode.y === draggedElement.gridstackNode.y){
            console.log("HHE")
            swappable = true;
          }
          console.log("SWAPPLE=",swappable)
          console.log("TOTAL HEIGHT=",totalHeight)
          console.log("DRAG HEIGHT=",draggedElement.gridstackNode.h)
          if(swappable && oneElement === undefined){
            console.log("GGG")
            if(swappableElement.length>0){
              // s.grid.batchUpdate()
              let originalElements = [];
              s.gridItems = s.grid.getGridItems();
              for(let i=0;i< s.gridItems.length;i++){
                originalElements.push({element:s.gridItems[i],
                  x: s.gridItems[i].gridstackNode.x,
                  y: s.gridItems[i].gridstackNode.y,
                  h: s.gridItems[i].gridstackNode.h,
                  w: s.gridItems[i].gridstackNode.w
                })
              }
              for(let i=0;i<swappableElement.length;i++){
                // console.log({...swappableElement[i].element.gridstackNode})
                console.log({...swappableElement[i].element.gridstackNode,
                  x: swappableElement[i].x,
                  y: swappableElement[i].y,
                  h: swappableElement[i].h,
                  w: swappableElement[i].w
                })
              }

              // s.grid.engine.nodes = [];
              // // console.log(widgetHeight)
              // for (let i=0;i<swappableElement.length;i++) {
              //   s.grid.engine.nodes.push({...swappableElement[i].element.gridstackNode,
              //     x: swappableElement[i].x,
              //     y: swappableElement[i].y,
              //     h: swappableElement[i].h,
              //     w: swappableElement[i].w
              //   });
              // }
              // if(isSwap){
              //   s.grid.update(draggedElement, {
              //     x: elementY,
              //   })
              // }
              // swappableElement.push({element:draggedElement,x:elementY})
              // for(let i=0;i<unSwappableElement.length;i++){
              //   s.grid.update(unSwappableElement[i].element,{
              //     x: unSwappableElement[i].x,
              //     y: unSwappableElement[i].y,
              //     h: unSwappableElement[i].h,
              //     w: unSwappableElement[i].w
              //   });
              // }
              // for(let i=0;i<unSwappableElement.length;i++){
              //   s.grid.update(unSwappableElement[i].element,{
              //     x: unSwappableElement[i].x,
              //     y: unSwappableElement[i].y
              //   })
              // }
              for(let i=0;i<swappableElement.length;i++){
                s.grid.update(swappableElement[i].element,{
                  x: swappableElement[i].x,
                  y: swappableElement[i].y,
                  h: swappableElement[i].h,
                  w: swappableElement[i].w
                })
              }
              for(let i=0;i<swappableElement.length;i++){
                  s.grid.update(swappableElement[i].element,{
                    y: swappableElement[i].y,
                    x: swappableElement[i].x,
                  })
              }
              
              for(let i=0;i<unSwappableElement.length-1;i++){
                console.log("HHEFLS")
                s.grid.update(unSwappableElement[i].element,{
                  x: unSwappableElement[i].x,
                  y: unSwappableElement[i].y
                })
              }
              // for(let i=0;i<swappableElement.length;i++){
              //   s.grid.update(swappableElement[i].element,{
              //     y: swappableElement[i].y
              //   })
              // }
              
              

              const newWidget = {
                content: ``,
                minW: elementW,
                minH: elementH,
                h: elementH,
                w: elementW,
                x: elementY,
                y:draggedElement.gridstackNode.y,
                autoPosition: false,
              };
              if(s.grid.willItFit(newWidget)){
                  // swappableElement.push({element:draggedElement,x:elementY})
                  
                  s.grid.update(draggedElement, {
                    x: elementY,
                  })
                  for(let i=0;i<swappableElement.length;i++){
                    s.grid.update(swappableElement[i].element,{
                      x: swappableElement[i].x,
                      y: swappableElement[i].y,
                      h: swappableElement[i].h,
                      w: swappableElement[i].w
                    })
                  }
                  
                  for(let i=0;i<unSwappableElement.length;i++){
                    swappableElement.push({element:unSwappableElement[i].element,
                      x: unSwappableElement[i].x,
                      y: unSwappableElement[i].y,
                      h: unSwappableElement[i].h,
                      w: unSwappableElement[i].w
                    })
                  }
                  for(let i=0;i<swappableElement.length - 1;i++){
                    for(let j=i+1;j<swappableElement.length; j++){
                      let temp;
                      if(swappableElement[i].x > swappableElement[j].x || ((swappableElement[i].x === swappableElement[j].x)) && swappableElement[i].y > swappableElement[j].y || ((swappableElement[i].y === swappableElement[j].y)))
                      {
                        temp = swappableElement[i];
                        swappableElement[i] =swappableElement[j];
                        swappableElement[j]=temp;
                      }
                    }
                  }
                  console.log(swappableElement)
                  for(let i=0;i<swappableElement.length;i++){
                    s.grid.update(swappableElement[i].element,{
                      y: swappableElement[i].y,
                      // x: swappableElement[i].x,
                    })
                  }
              }else{
                console.log(originalElements)
                for(let i=0;i<originalElements.length;i++){
                  s.grid.update(originalElements[i].element,{
                    x: originalElements[i].x,
                    y: originalElements[i].y,
                    h: originalElements[i].h,
                    w: originalElements[i].w
                  })
                }
                for(let i=0;i<originalElements.length;i++){
                  s.grid.update(originalElements[i].element,{
                    x: originalElements[i].x,
                    y: originalElements[i].y,
                  })
                }
              }

              // for(let i=0;i<unSwappableElement.length;i++){
              //   s.grid.update(unSwappableElement[i].element,{
              //     y: unSwappableElement[i].y
              //   })
              // }
              // s.gridItems = s.grid.getGridItems();
              // for(let i=0;i< s)
              // s.grid.engine.nodes = [];
              // s.grid.commit()
            // console.log(widgetHeight)
            // for (const widget of s.gridItems) {
            //   s.grid.engine.nodes.push(widget.gridstackNode);
            // }
            // for(let i=0; i<swappableElement.length;i++){
            //   let event = new Event('drag');
            //   swappableElement[i].element.dispatchEvent(event);
            //   s.resizeElement(swappableElement[i].element.gridstackNode.h,swappableElement[i].element)
            // }
            
            // s.gridItems = s.grid.getGridItems();
            // s.grid.removeAll();
            // for (const widget of s.gridItems) {
            //   s.grid.addWidget(widget)
            // }
            // s.addWidgetResizeHandle();
            
            }
          
            // s.resizeElement(s.gridFirstRowHeight)
          }else if(oneElement != undefined){
            console.log("ELSE")
            if(swappableElement.length>0){
              for(let i=0;i<swappableElement.length;i++){
                s.grid.update(swappableElement[i].element,{
                  x: swappableElement[i].x,
                  y: swappableElement[i].y
                })
              }
              for(let i=0;i<unSwappableElement.length;i++){
                swappableElement.push({element:unSwappableElement[i].element,
                  x: unSwappableElement[i].x,
                  y: unSwappableElement[i].y,
                  h: unSwappableElement[i].h,
                  w: unSwappableElement[i].w
                })
              }
              for(let i=0;i<swappableElement.length - 1;i++){
                for(let j=i+1;j<swappableElement.length; j++){
                  let temp;
                  if(swappableElement[i].x > swappableElement[j].x || ((swappableElement[i].x === swappableElement[j].x)) && swappableElement[i].y > swappableElement[j].y || ((swappableElement[i].y === swappableElement[j].y)))
                  {
                    temp = swappableElement[i];
                    swappableElement[i] =swappableElement[j];
                    swappableElement[j]=temp;
                  }
                }
              }
              console.log(swappableElement)
              for(let i=0;i<swappableElement.length;i++){
                s.grid.update(swappableElement[i].element,{
                  y: swappableElement[i].y,
                  // x: swappableElement[i].x,
                })
              }
              // if(isSwap){
              //   s.grid.update(draggedElement, {
              //     x: elementY,
              //   })
              // }
            }
          
        //     // s.resizeElement(s.gridFirstRowHeight)
          }
        }
      })
      // s.gridItems = s.grid.getGridItems();
      // s.grid.removeAll();
      // for (const widget of s.gridItems) {
      //   s.grid.addWidget(widget)
      // }
      draggedElement = undefined;
      elementY = undefined
  
    });

    // this.grid.on('dropped', function(event: Event, previousWidget: GridStackNode, newWidget: GridStackNode) {
    //   console.log("HH")
    //   console.log(previousWidget)
    //   console.log(newWidget)
    //   // let x = parseInt(el.getAttribute('gs-x')) || 0;
    //   // or all values...
    //   // let node: GridStackNode = el.gridstackNode; // {x, y, width, height, id, ....}
    // });
    // if(this.gridItems.length % 2 === 1){
    //   for(let i=0;i<this.gridItems.length-1;i++){
    //     this.gridItems[i].addEventListener('mouseup', function(this){
    //       let widgetWidth:any = `${this.style.height}`;
    //       widgetWidth=widgetWidth.replace('px','');
    //       widgetWidth= widgetWidth * 1;
    //     console.log(i)
    //       s.newGrid(Math.floor(widgetWidth/s.cellHeight))
    //     })

    //   }
    // }else{
    //   for(let i=0;i<this.gridItems.length;i++){
    //     this.gridItems[i].addEventListener('mouseup', function(this){
    //       let widgetWidth:any = `${this.style.height}`;
    //       widgetWidth=widgetWidth.replace('px','');
    //       widgetWidth= widgetWidth * 1;
    //       console.log(this.gridItems[i])
    //       s.newGrid(Math.floor(widgetWidth/s.cellHeight))
    //     })
    //   }
    // }
    
    // this.gridItems = this.grid.getGridItems();
    // this.grid.removeAll()
    // this.grid.engine.nodes = [];
    // console.log(this.gridItems[0])
    // this.grid.load(this.gridItems)
    // for (const widget of this.gridItems) {
    //   console.log(widget)
    //   widget.removeEventListener('mouseup', function(this){})
    //   this.grid.engine.nodes.push(widget.gridstackNode);
    // }
    // this.grid.on('drag', function(event: Event, items: GridStackNode[]) {
    //   console.log(items)
    //   console.log("Drag")
    // });

    // this.grid.on('resize', function(event: Event, el: GridItemHTMLElement) {
    //   console.log(event)
    // });
  }

  addWidgetResizeHandle(){
    this.gridItems = this.grid.getGridItems();
    let s=this;
    this.gridItems.forEach((grid)=>{
      grid.getElementsByClassName('ui-resizable-se')[0].addEventListener('mouseup', function(this){
        let widgetHeight:any = `${grid.clientHeight}`;
        widgetHeight=widgetHeight.replace('px','');
        widgetHeight= widgetHeight * 1;
        // s.newGrid(Math.floor(widgetHeight/s.cellHeight), grid)
        console.log(Math.floor(widgetHeight/s.cellHeight))
        s.resizeElement(Math.floor(widgetHeight/s.cellHeight), grid)
      })
      grid.getElementsByClassName('ui-resizable-sw')[0].addEventListener('mouseup', function(this){
        let widgetHeight:any = `${grid.clientHeight}`;
        widgetHeight=widgetHeight.replace('px','');
        widgetHeight= widgetHeight * 1;
        // s.newGrid(Math.floor(widgetHeight/s.cellHeight), grid)
        console.log(Math.floor(widgetHeight/s.cellHeight))
        s.resizeElement(Math.floor(widgetHeight/s.cellHeight), grid)
      })
    });
  }
  resizeElement(widgetHeight:any, item?:any){
    console.log(widgetHeight)
    if(item){
      if(item.gridstackNode.y !== 0)
      { 
        // console.log(item.gridstackNode.y)
        // console.log(widgetHeight)
        widgetHeight = this.maxGridRow - widgetHeight;
        // console.log(widgetHeight)
        // this.gridFirstRowHeight = widgetHeight;
      }
    }
    if(widgetHeight < this.minElementHeight){
      widgetHeight = this.minElementHeight;
    }
    if(widgetHeight > this.maxElementHeight){
      widgetHeight = this.maxElementHeight;
    }
    // this.gridFirstRowHeight = widgetHeight; 
    
    console.log("RESIZEELEMENT")
    
    this.gridItems = this.grid.getGridItems();
    this.grid.engine.nodes = [];
    // console.log(widgetHeight)
    for (const widget of this.gridItems) {
      this.grid.engine.nodes.push(widget.gridstackNode);
    }
    let resizeElement:any = [];
    let notResizeElement:any = [];
    console.log(item)
    this.findAffectedElements(resizeElement,item);
    for(let i = 0; i < resizeElement.length; i++){
      this.findAffectedElements(resizeElement,resizeElement[i])
    }


    // console.log(item.gridstackNode)
    // console.log("X=",item.gridstackNode.x)
    // console.log("W=",(item.gridstackNode.x+item.gridstackNode.w))
    // for(let i = 0; i < this.gridItems.length; i++){
    //   if(this.gridItems[i] !== item){
    //     if(item.gridstackNode.x<=this.gridItems[i].gridstackNode.x && this.gridItems[i].gridstackNode.x<(item.gridstackNode.x+item.gridstackNode.w)){
    //       resizeElement.push(this.gridItems[i])
    //     } else if(item.gridstackNode.x<(this.gridItems[i].gridstackNode.x+this.gridItems[i].gridstackNode.w) && (this.gridItems[i].gridstackNode.x+this.gridItems[i].gridstackNode.w)<(item.gridstackNode.x+item.gridstackNode.w)){
    //       resizeElement.push(this.gridItems[i]);
    //     }
    //   }
    // }
    // console.log(resizeElement)
    

    for (let i = 0; i < this.gridItems.length; i++) {
      if(!resizeElement.includes(this.gridItems[i])){
        // console.log(this.gridItems[i].gridstackNode.y)
        notResizeElement.push({element:this.gridItems[i], x:this.gridItems[i].gridstackNode.x,y:this.gridItems[i].gridstackNode.y,h:this.gridItems[i].gridstackNode.h,w:this.gridItems[i].gridstackNode.w})
      }
    }
    console.log(notResizeElement)
    for (let i = 0; i < resizeElement.length; i++) {
      resizeElement[i] = {element:resizeElement[i], x:resizeElement[i].gridstackNode.x, y:resizeElement[i].gridstackNode.y,h:resizeElement[i].gridstackNode.h,w:resizeElement[i].gridstackNode.w}
    }
    // console.log(resizeElement);
    let allElements = [];
    if(resizeElement.length > 0){
      // for(let i = 0; i < notResizeElement.length; i++) {
      //   this.grid.update(notResizeElement[i].element, {
      //     x:notResizeElement[i].x,
      //     y:notResizeElement[i].y,
      //     h: notResizeElement[i].h
      //   });
      //  allElements.push({element:notResizeElement[i].element,x:notResizeElement[i].x,y:notResizeElement[i].y,h:notResizeElement[i].h,w:notResizeElement[i].w})
      // }
      // for(let i = 0; i < notResizeElement.length; i++) {
      //   this.grid.update(notResizeElement[i].element, {
      //     y:notResizeElement[i].y,
      //   })
      // }
      for (let i = 0; i < resizeElement.length; i++) {
        if(resizeElement[i].y === 0 && resizeElement[i].h != this.maxGridRow){
          this.grid.update(resizeElement[i].element, {
            x:resizeElement[i].x,y:resizeElement[i].y,h:widgetHeight,w:resizeElement[i].w
          })
          // console.log()
          allElements.push({element:resizeElement[i].element,x:resizeElement[i].x,y:resizeElement[i].y,h:widgetHeight,w:resizeElement[i].w})
        } else if (resizeElement[i].y != 0 && resizeElement[i].h != this.maxGridRow){
          this.grid.update(resizeElement[i].element, {
            x:resizeElement[i].x,y:widgetHeight,h:this.maxGridRow - widgetHeight,w:resizeElement[i].w
          })
          allElements.push({element:resizeElement[i].element,x:resizeElement[i].x,y:widgetHeight,h:this.maxGridRow - widgetHeight,w:resizeElement[i].w})
        }
      }
  
      // for (let i = 0; i < resizeElement.length; i++) {
      //   if(resizeElement[i].y === 0 && resizeElement[i].h != this.maxGridRow){
      //     this.grid.update(resizeElement[i].element, {
      //       y:0,
      //     })
      //   } else if (resizeElement[i].y != 0 && resizeElement[i].h != this.maxGridRow){
      //     this.grid.update(resizeElement[i].element, {
      //       y:widgetHeight,
      //     })
      //   }
      // }
      
    }else{
    // for (let i = 0; i < this.gridItems.length; i++) {
    //   if(this.gridItems[i].gridstackNode.y === 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
    //     this.grid.update(this.gridItems[i], {
    //       x:this.gridItems[i].gridstackNode.x,
    //       y:0,
    //       h: widgetHeight
    //     })
    //   } else if (this.gridItems[i].gridstackNode.y != 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
    //     this.grid.update(this.gridItems[i], {
    //       x:this.gridItems[i].gridstackNode.x,
    //       y:widgetHeight,
    //       h: this.maxGridRow - widgetHeight
    //     })
    //   }
      
     
    // }

    // for (let i = 0; i < this.gridItems.length; i++) {
    //   if(this.gridItems[i].gridstackNode.y === 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
    //     this.grid.update(this.gridItems[i], {
    //       y:0,
    //     })
    //   } else if (this.gridItems[i].gridstackNode.y != 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
    //     this.grid.update(this.gridItems[i], {
    //       y:widgetHeight,
    //     })
    //   }
      
     
    // }
  }
  // console.log('All',allElements)
  for(let i=0;i<allElements.length;i++){
    this.grid.update(allElements[i].element, {
            y:allElements[i].y,
            x:allElements[i].x,
            h:allElements[i].h,
            w:allElements[i].w,
    })
  }
  for(let i=0;i<allElements.length;i++){
    this.grid.update(allElements[i].element, {
        y:allElements[i].y,
        x:allElements[i].x
    })
  }
  for(let i=0;i<notResizeElement.length;i++){
    this.grid.update(notResizeElement[i].element, {
      y:notResizeElement[i].y,
    })
  }
  }

  findAffectedElements(resizeElement:any,item:any){
    // let resizeElement=[];
    for(let i = 0; i < this.gridItems.length; i++){
      if(this.gridItems[i] !== item){
        if(item.gridstackNode.x<=this.gridItems[i].gridstackNode.x && this.gridItems[i].gridstackNode.x<(item.gridstackNode.x+item.gridstackNode.w)){
          if(!resizeElement.includes(this.gridItems[i])){
            // console.log(this.gridItems[i].gridstackNode)
            resizeElement.push(this.gridItems[i])
          }
        } else if(item.gridstackNode.x<(this.gridItems[i].gridstackNode.x+this.gridItems[i].gridstackNode.w) && (this.gridItems[i].gridstackNode.x+this.gridItems[i].gridstackNode.w)<(item.gridstackNode.x+item.gridstackNode.w)){
          if(!resizeElement.includes(this.gridItems[i])){
            resizeElement.push(this.gridItems[i])
          }
        } else if(item.gridstackNode.x >= this.gridItems[i].gridstackNode.x && (item.gridstackNode.x+item.gridstackNode.w) <= (this.gridItems[i].gridstackNode.x+this.gridItems[i].gridstackNode.w)){
          if(!resizeElement.includes(this.gridItems[i])){
            resizeElement.push(this.gridItems[i])
          }
        }
      }
    }
    return resizeElement;
  }

  newGrid(widgetHeight:any, item){
    // console.log(item.gridstackNode)
    console.log("newGrid")
    this.gridItems = this.grid.getGridItems();
    this.grid.engine.nodes = [];
    for (const widget of this.gridItems) {
      this.grid.engine.nodes.push(widget.gridstackNode);
    }
    
    const isOddWidget = this.gridItems.length % 2 === 0 ? false : true;
    let isLast = false;
    if(isOddWidget){
      isLast = item === this.gridItems[this.gridItems.length-1];
    }
    // console.log(isLast)
    if(!isLast){
    let widgetYPosition = 0;
    
    let widgetWidth = 6;
    if (!isOddWidget) {
      widgetWidth = Math.floor((this.maxGridColumn / this.gridItems.length) * 2);
    } else {
      widgetWidth = Math.floor(
        this.maxGridColumn / Math.ceil(this.gridItems.length / 2)
      );
    }
    if(item.gridstackNode.y !== 0){
      widgetHeight = this.maxGridRow - widgetHeight;
    }
    
    let j = 0;
    for (let i = 0; i < this.gridItems.length; i++) {
      if (i % 2 === 0 && i !== 0) {
        j = j + widgetWidth;
      }
      if (isOddWidget && this.gridItems.length - 1 === i) {
        this.grid.update(this.gridItems[i], {
          minH: 1,
          minW: 1,
          // w: this.maxGridColumn,
          h: this.maxGridRow,
          autoPosition: true,
          maxH: this.maxGridRow,
          // x: j,
          y: 0,
        });
      } else {
        let height = 0;
        if(widgetYPosition ===0){
          height = widgetHeight;
        }else{
          height =this.maxGridRow - widgetHeight;
        }
        this.grid.update(this.gridItems[i], {
          minH: 1,
          minW: 1,
          maxH: this.maxGridRow,
          // w: widgetWidth,
          h: height,
          // x: j,
          y: widgetYPosition,
        });
        widgetYPosition = widgetYPosition === 0 ? widgetHeight : 0;
      }
    }
    widgetYPosition = 0;
    j = 0;
    // for (let i = 0; i < this.gridItems.length; i++) {
    //   if (i % 2 === 0 && i !== 0) {
    //     j = j + widgetWidth;
    //   }
    //   if (isOddWidget && this.gridItems.length - 1 === i) {
    //     this.grid.update(this.gridItems[i], { x: j, y: 0 });
    //   } else {
    //     this.grid.update(this.gridItems[i], { x: j, y: widgetYPosition });
    //     widgetYPosition = widgetYPosition === 0 ? widgetHeight : 0;
    //   }
    // }
  }
  }

  resizeGrid() {
    let widgetYPosition = 0;
    this.gridItems = this.grid.getGridItems();
    this.grid.engine.nodes = [];
    for (const widget of this.gridItems) {
      this.grid.engine.nodes.push(widget.gridstackNode);
    }

    const isOddWidget = this.gridItems.length % 2 === 0 ? false : true;
    
    let widgetWidth = 6;
    // this.isOneWidget();
    if (!isOddWidget) {
      widgetWidth = Math.floor((this.maxGridColumn / this.gridItems.length) * 2);
    } else {
      widgetWidth = Math.floor(
        this.maxGridColumn / Math.ceil(this.gridItems.length / 2)
      );
    }
    let widgetHeight = this.maxGridRow/2;
    let j = 0;
    for (let i = 0; i < this.gridItems.length; i++) {
      if (i % 2 === 0 && i !== 0) {
        j = j + widgetWidth;
      }
      if (isOddWidget && this.gridItems.length - 1 === i) {
        this.grid.update(this.gridItems[i], {
          minH: 1,
          minW: 1,
          w: this.maxGridColumn,
          h: this.maxGridRow,
          autoPosition: true,
          maxH: this.maxGridRow,
          x: j,
          y: 0,
        });
      } else {
        this.grid.update(this.gridItems[i], {
          minH: 1,
          minW: 1,
          maxH: this.maxGridRow,
          w: widgetWidth,
          h: widgetHeight,
          x: j,
          y: widgetYPosition,
        });
        widgetYPosition = widgetYPosition === 0 ? this.maxGridRow / 2 : 0;
      }
    }
    widgetYPosition = 0;
    j = 0;
    for (let i = 0; i < this.gridItems.length; i++) {
      if (i % 2 === 0 && i !== 0) {
        j = j + widgetWidth;
      }
      if (isOddWidget && this.gridItems.length - 1 === i) {
        this.grid.update(this.gridItems[i], { x: j, y: 0 });
      } else {
        this.grid.update(this.gridItems[i], { x: j, y: widgetYPosition });
        widgetYPosition = widgetYPosition === 0 ? this.maxGridRow / 2 : 0;
      }
    }
  }
}
