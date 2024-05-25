---
layout: post
title: layui-table多样化编辑
date: 2024-05-24
top: 1
categories: code
tags:
  - html
  - jquery
  - jsvascript
---

# layui实现多样化编辑

[在线示例](https://codepen.io/hjingsuper/pen/yLWJPoW)

分享点：
 - table的select使用
 - 根据返回数据中某个字段来判断开启该行的编辑
 - table全局设置
 - 自定义form验证，可同时用于table验证
 - scrollPos: "fixed" 使用编辑，建议开启重载数据时，保持滚动条位置不变
 - 点击单元格打开子表，比如打开子表编辑后计算合计再显示
 - treetable的注意事项
 - treetable的select使用
 - treetable使用平铺数据格式

```html
<div class="layui-container">
  <blockquote class="layui-elem-quote">layui 2.9.10</blockquote>

  <table class="layui-table" id="MianTable" lay-filter="MianTable" lay-data="{id: 'MianTable'}">
  </table>
  <table class="layui-table" id="TreeMianTable" lay-filter="TreeMianTable" lay-data="{id: 'TreeMianTable'}">
  </table>
</div>

<script type="text/html" id="toolbar">
  <div class="layui-btn-container">
    <button class="layui-btn layui-btn-sm" lay-event="AddRowButton">新增行</button>
    <button class="layui-btn layui-btn-sm" lay-event="DelRowButton">删除行</button>
  </div>
</script>

<script type="text/html" id="sexTpl">
{{# if(d.IsEdit==1){ }}
  <select name="select-sex" class="layui-border select-sex" lay-ignore>
    <option value="">请选择</option>
    <option value="男" {{d.sex=="男"?"selected":""}}>男</option>
    <option value="女" {{d.sex=="女"?"selected":""}}>女</option>
  </select>
  {{# } else { }}
    {{= d.sex }}
    {{# } }}
</script>

<script type="text/html" id="AddSubItemTotalTpl">
{{# if(d.IsEdit==1 ){ }}
  <a class="" lay-event="openSubItem" style='width:100%;height: 100%;display: block;'>{{d.subItemTotal}}</a>
  {{# } else { }}
    {{= d.subItemTotal }}
    {{# } }}
</script>

<script type="text/html" id="treetoolbar">
  <div class="layui-btn-container">
    <button class="layui-btn layui-btn-sm" lay-event="AddRowButton">新增父节点</button>
    <button class="layui-btn layui-btn-sm" lay-event="InitRowButton">初始化</button>
  </div>
</script>
<script type="text/html" id="ItemTools">
  <div class="layui-btn-container">
    <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="addChild">新增子节点</a>
    <a class="layui-btn layui-btn-warm layui-btn-xs" lay-event="delChild">删除</a>
  </div>
</script>
```

```javascript
layui.use(["jquery", "table", "treeTable", "form", "layer"], function () {
  var $ = layui.jquery,
    table = layui.table,
    treeTable = layui.treeTable,
    layer = layui.layer,
    form = layui.form;

  // 根据返回数据中某个字段来判断开启该行的编辑
  var editable = function (d) {
    if (d.IsEdit == 1) {
      return "text";
    }
  };

  //https://gitee.com/layui/layui/issues/I8GQGV
  table.set({
    cellExpandedMode: "tips"
    // page: {
    //   layout: ["count", "prev", "page", "next", "limit", "skip"],
    //   limits: [20, 50, 100, 300, 500],
    //   limit: 20,
    //   groups: 5
    // }
  });

  //https://gitee.com/layui/layui/issues/I88E64
  //设置全局form验证
  form.verify({
    required: function (value, elem) {
      if (
        !/[\S]+/.test(value) ||
        value == null ||
        value === "" ||
        value.length < 1 ||
        value == undefined ||
        typeof value == undefined ||
        value == "null" ||
        value == "undefined" ||
        String(value) == ""
      ) {
        return "必填项不能为空";
      }
      return false;
    },
    int: function (value, elem) {
      if (!value) return;
      if (!/^[+-]?[0-9]\d{0,9}$/.test(value)) {
        return "请输入正确的整数";
      }
      return false;
    }
    // more...
  });

  //table
  {
    table.render({
      elem: "#MianTable",
      toolbar: "#toolbar",
      limit: 100,
      height: 300,
      scrollPos: "fixed", //使用编辑，建议开启重载数据时，保持滚动条位置不变
      data: [],
      cols: [
        [
          { checkbox: true, fixed: "left" },
          { field: "id", title: "ID", width: 80, hide: true },
          //maxlength定义最大长度；edit: "text"
          { maxlength: 10, field: "username", title: "用户名", edit: "text" },
          //下拉选择列
          { field: "sex", title: "性别", templet: "#sexTpl" },
          //verify验证int；edit: editable
          { verify: "int", field: "age", title: "年龄", edit: editable },
          //verify验证float；edit: function
          {
            verify: "float",
            field: "height",
            title: "身高",
            edit: function (d) {
              if (d.IsEdit == 1) {
                return "text";
              }
            }
          },
          //打开子页面
          {
            field: "subItemTotal",
            title: "子集",
            templet: "#AddSubItemTotalTpl"
          }
        ]
      ],
      done: function (res, curr, count) {
        var options = this;
        //https://github.com/layui/layui/discussions/1774#discussioncomment-9077177
        // 获取当前行数据
        table.getRowData = function (tableId, elem) {
          var index = $(elem).closest("tr").data("index");
          return table.cache[tableId][index] || {};
        };

        var tableViewElem = this.elem.next();
        // 解除 tbSelect 命名空间下的所有 change 事件处理程序
        tableViewElem.off("change.tbSelect");
        // 将 '.select-sex' 元素的 change 事件委托给 tableViewElem, 事件命名空间为 tbSelect
        tableViewElem.on("change.tbSelect", ".select-sex", function () {
          var value = this.value; // 获取选中项 value
          var data = table.getRowData(options.id, this);
          data.sex = value;

          //如果要改变其他列的值，需要重新渲染数据
          data.age = 18;
          table.renderData("MianTable"); //该方法用于重新渲染数据，一般在修改 table.cache 后使用。
        });
      }
    });

    //单元格编辑事件
    table.on("edit(MianTable)", function (obj) {
      let that = this;

      var data = obj.data;
      var col = obj.getCol();
      var field = obj.field;
      var value = obj.value;
      var maxlength = col.maxlength; //获取自定义长度验证
      var verify = col.verify; //获取自定义类型验证

      var f = true;
      if (maxlength) {
        if (value.length > parseInt(maxlength)) {
          layer.tips(col.title + "字数过长已截取，请确认", that, { tips: 1 });
          data[field] = value.substring(0, parseInt(maxlength));
          obj.update(data, true);
          f = false;
        }
      }
      if (verify) {
        if (value.trim() != "" && verify.trim() != "") {
          //使用自定义form验证
          if (form.config.verify[verify](value)) {
            layer.tips(form.config.verify[verify](value), that, { tips: 1 });
            data[field] = "";
            obj.update(data, true);
            f = false;
          }
        }
      }
      if (!f) {
        return f;
      }
      switch (field) {
        case "username":
          //请求后修改data
          $.ajax({
            type: "get",
            dataType: "json",
            url: "",
            data: data,
            success: function (result) {
              data[field] = "123";
              data["sex"] = "女";
              data["age"] = "18";

              //obj.update第二个参数 related	是否更新其他包含自定义模板且可能有所关联的列视图
              obj.update(data, true);
            }
          });
          break;
      }
    });

    //头部工具栏事件
    table.on("toolbar(MianTable)", function (obj) {
      var id = obj.config.id;
      var checkStatus = table.checkStatus(id);

      switch (obj.event) {
        case "AddRowButton":
          let json = {
            rowid: Date.now(),
            IsEdit: 0
          };

          var tabledata = table.getData(id);
          tabledata.push(json);

          table.reloadData("MianTable", { data: tabledata });

          break;
        case "DelRowButton":
          if (checkStatus.data.length < 1) {
            layer.msg("没有需要操作的数据！");
            return false;
          }
          var tabledata = table.getData(id);

          var checkdata = checkStatus.data;
          var set = checkdata.map((item) => item.rowid);

          var newData = tabledata.filter((item) => !set.includes(item.rowid));

          table.reloadData("MianTable", { data: newData });

          break;
      }
    });

    //单元格工具事件
    table.on("tool(MianTable)", function (obj) {
      var data = obj.data,
        layEvent = obj.event;

      switch (layEvent) {
        case "openSubItem":
          //打开子页面，比如打开子表编辑后计算合计再显示
          //https://github.com/layui/layui/issues/1506
          //https://github.com/layui/layui/issues/1518
          layer.prompt(
            { title: "请输入文本", formType: 2 },
            function (value, index, elem) {
              data.subItemTotal = value;
              obj.update(data, true);
              console.log(data);
              // 关闭 prompt
              layer.close(index);
            }
          );
          break;
        default:
      }
    });

    // 行事件
    table.on("rowDouble(MianTable)", function (obj) {
      var data = obj.data; // 得到当前行数据

      //双击改变编辑状态
      //当IsEdit为1时，使select可选。需要obj.update第二个参数
      // related	是否更新其他包含自定义模板且可能有所关联的列视图
      // https://github.com/layui/layui/discussions/1896
      // https://github.com/layui/layui/discussions/1941
      obj.update({ IsEdit: 1 }, true);
    });
  }

  // treetable
  {
    treeTable.render({
      elem: "#TreeMianTable",
      toolbar: "#treetoolbar",
      data: [],
      limit: 100,
      height: 300,
      scrollPos: "fixed", //使用编辑，建议开启重载数据时，保持滚动条位置不变
      tree: {
        // https://github.com/layui/layui/discussions/1752#discussioncomment-8998549
        customName: {
          name: "rowid", //自定义「节点」属性名
          id: "rowid", //自定义「节点索引」属性名
          pid: "pid" //自定义「父节点索引」属性名
        },
        data: {
          isSimpleData: true, // 是否使用平铺数据格式(Array)
          rootPid: "0", //用于设置根节点的 pid 属性值
          cascade: "children" //仅对子节点联动
        },
        view: {
          // https://github.com/layui/layui/discussions/1774#discussioncomment-9066555
          dblClickExpand: false, //treeTable中使用 原生 select，多次点击select会导致节点展开或关闭。// 双击节点时，是否自动展开父节点
          showIcon: false, //是否显示节点图标
          expandAllDefault: true //是否默认展开全部节点
        },
        async: {},
        callback: {}
      },
      cols: [
        [
          { checkbox: true, fixed: "left" },
          {
            title: "操作",
            width: 150,
            align: "center",
            toolbar: "#ItemTools"
          },
          { field: "rowid", title: "rowid" },
          { maxlength: 10, field: "username", title: "用户名", edit: "text" },
          { field: "sex", title: "性别", templet: "#sexTpl" },
          { verify: "int", field: "age", title: "年龄", edit: editable },
          {
            verify: "int",
            field: "height",
            title: "身高",
            edit: function (d) {
              if (d.IsEdit == 1) {
                return "text";
              }
            }
          }
        ]
      ],
      done: function (res, curr, count) {
        var options = this;

        // https://github.com/layui/layui/discussions/1774#discussioncomment-9067971
        // 获取当前行数据
        table.getRowData = function (tableId, elem) {
          var index = $(elem).closest("tr").data("index");
          return table.cache[tableId][index] || {};
        };

        var tableViewElem = this.elem.next();
        // 解除 tbSelect 命名空间下的所有 change 事件处理程序
        tableViewElem.off("change.tbSelect");
        // 将 '.select-sex' 元素的 change 事件委托给 tableViewElem, 事件命名空间为 tbSelect
        tableViewElem.on("change.tbSelect", ".select-sex", function () {
          var value = this.value; // 获取选中项 value
          var data = table.getRowData(options.id, this);
          data.sex = value;

          //如果要改变其他列的值，需要重新渲染数据
          var DATA_INDEX = data.LAY_DATA_INDEX; //此处需要内部字段更新行数据
          treeTable.updateNode("TreeMianTable", DATA_INDEX, {
            age: 18
          });
        });
      }
    });

    treeTable.on("toolbar(TreeMianTable)", function (obj) {
      var id = obj.config.id;
      var checkStatus = treeTable.checkStatus(id);

      switch (obj.event) {
        case "AddRowButton":
          treeTable.addNodes(id, {
            parentIndex: "",
            index: -1,
            data: {
              rowid: Date.now(),
              IsEdit: 0
            }
          });

          break;
        case "InitRowButton":
          //使用平铺数据格式(Array)
          //https://github.com/layui/layui/issues/1885
          treeTable.reloadData("TreeMianTable", {
            data: [
              {
                username: 1,
                rowid: "1",
                pid: "0"
              },
              { username: 2, rowid: "2", pid: "1" },
              { username: 3, rowid: "3", pid: "0" }
            ]
          });
          break;

        default:
      }
    });
    treeTable.on("tool(TreeMianTable)", function (obj) {
      var data = obj.data;
      var id = obj.config.id;
      switch (obj.event) {
        case "addChild":
          let json = {
            rowid: Date.now(),
            IsEdit: 0
          };

          treeTable.addNodes(id, {
            parentIndex: data["LAY_DATA_INDEX"],
            index: -1,
            data: json
          });

          break;
        case "delChild":
          obj.del();

          break;

        default:
      }
    });

    // 行事件
    table.on("rowDouble(TreeMianTable)", function (obj) {
      var data = obj.data; // 得到当前行数据

      // 双击改变编辑状态
      // 当IsEdit为1时，使select可选。需要obj.update第二个参数
      // related	是否更新其他包含自定义模板且可能有所关联的列视图
      // https://github.com/layui/layui/discussions/1896
      obj.update({ IsEdit: 1 }, true);

      //两种方式更新都可以
      // var DATA_INDEX = data.LAY_DATA_INDEX; //此处需要内部字段更新行数据
      // treeTable.updateNode("TreeMianTable", DATA_INDEX, {
      //   IsEdit: 1
      // });
    });
  }
});

```
