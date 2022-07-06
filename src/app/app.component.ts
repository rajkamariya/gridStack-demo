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
    this.addWidgetResizeHandle()
    this.grid.on('dragstop', function(event: Event, el: GridItemHTMLElement) {
      console.log("DRAGSTOP");
      s.resizeElement(s.gridFirstRowHeight)
      s.gridItems = s.grid.getGridItems();
      for(let i=0;i<s.gridItems.length - 1;i++){
        for(let j=i+1;j<s.gridItems.length; j++){
          let temp;
          if(s.gridItems[i].gridstackNode.x > s.gridItems[j].gridstackNode.x || ((s.gridItems[i].gridstackNode.x === s.gridItems[j].gridstackNode.x) && (s.gridItems[i].gridstackNode.y > s.gridItems[j].gridstackNode.y)))
          {
            temp = s.gridItems[i];
            s.gridItems[i] =s.gridItems[j];
            s.gridItems[j]=temp;
          }
        }
      }
      s.grid.removeAll();
      for (const widget of s.gridItems) {
        s.grid.addWidget(widget)
      }
      s.addWidgetResizeHandle();
        s.resizeElement(s.gridFirstRowHeight)
    });
    console.log(this.gridItems)

    this.gridItems.forEach((grid)=>{
      let draggedElement;
      let elementY;
      let elementX;
      let elementH;
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
          let isSwap=false;
          s.gridItems.forEach((grid)=>{
            if(grid !== draggedElement){
              if(grid.gridstackNode.y >= draggedElement.gridstackNode.y && grid.gridstackNode.h <= draggedElement.gridstackNode.h && grid.gridstackNode.x === elementY && draggedElement.gridstackNode.h === s.maxGridRow){
                swappableElement.push({element:grid, y:grid.gridstackNode.y, x:draggedElement.gridstackNode.x});
                
                isSwap = true;
              }else if(grid.gridstackNode.x === elementY && grid.gridstackNode.y === elementX && grid.gridstackNode.h === elementH){
                console.log(elementY)
                console.log(grid.gridstackNode.x)
                console.log(elementX)
                console.log(grid.gridstackNode.y)

                oneElement = grid;
                console.log("DDF")
              } else{
                swappableElement.push({element:grid, y:grid.gridstackNode.y, x:grid.gridstackNode.x});
              }
             
            }
            
          })
          console.log(swappableElement)
          console.log(oneElement)
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
            swappableElement.push({element:oneElement,x:dragX,y:dragY})
            swappableElement.push({element:draggedElement,x:oneElementX,y:oneElementY})
            }else{
            swappableElement.push({element:draggedElement,x:oneElementX,y:oneElementY})

              swappableElement.push({element:oneElement,x:dragX,y:dragY})
            }// s.grid.update(oneElement, {
            //   x:dragX,
            //   y:dragY
            // })
            // s.grid.update(draggedElement, {
            //   x:oneElementX,
            //   y:oneElementY
            // })
          }
          if(swappableElement.length>0){
            for(let i=0;i<swappableElement.length;i++){
              s.grid.update(swappableElement[i].element,{
                x: swappableElement[i].x,
                y: swappableElement[i].y
              })
            }
            if(isSwap){
              s.grid.update(draggedElement, {
                x: elementY,
              })
          }
          
            s.resizeElement(s.gridFirstRowHeight)
            
          }
        }
      })
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
    // console.log(item.gridstackNode.y)
    if(item){
      if(item.gridstackNode.y !== 0)
      { 
        // console.log(item.gridstackNode.y)
        console.log(widgetHeight)
        widgetHeight = this.maxGridRow - widgetHeight;
        console.log(widgetHeight)
        // this.gridFirstRowHeight = widgetHeight;
      }
      }
    if(widgetHeight < this.minElementHeight){
      widgetHeight = this.gridFirstRowHeight;
    }
    if(widgetHeight > this.maxElementHeight){
      widgetHeight = this.gridFirstRowHeight;
    }
    this.gridFirstRowHeight = widgetHeight; 
    
    console.log("RESIZEELEMENT")
    if(item){
      // console.log(item)
      console.log(item.gridstackNode.h)
      console.log(this.gridFirstRowHeight)
    // if(item.gridstackNode.h > this.gridFirstRowHeight){
    //   this.grid.update(item,{
    //     h:this.gridFirstRowHeight
    //   })
    //   return
    // }
    }
    this.gridItems = this.grid.getGridItems();
    this.grid.engine.nodes = [];
    // console.log(widgetHeight)
    for (const widget of this.gridItems) {
      this.grid.engine.nodes.push(widget.gridstackNode);
    }
    for (let i = 0; i < this.gridItems.length; i++) {
      if(this.gridItems[i].gridstackNode.y === 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
        this.grid.update(this.gridItems[i], {
          x:this.gridItems[i].gridstackNode.x,
          y:0,
          h: widgetHeight
        })
      } else if (this.gridItems[i].gridstackNode.y != 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
        this.grid.update(this.gridItems[i], {
          x:this.gridItems[i].gridstackNode.x,
          y:widgetHeight,
          h: this.maxGridRow - widgetHeight
        })
      }
      
     
    }

    for (let i = 0; i < this.gridItems.length; i++) {
      if(this.gridItems[i].gridstackNode.y === 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
        this.grid.update(this.gridItems[i], {
          y:0,
        })
      } else if (this.gridItems[i].gridstackNode.y != 0 && this.gridItems[i].gridstackNode.h != this.maxGridRow){
        this.grid.update(this.gridItems[i], {
          y:widgetHeight,
        })
      }
      
     
    }
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
