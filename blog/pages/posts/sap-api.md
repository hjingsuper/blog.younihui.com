---
layout: post
title: c#调用SAP接口
date: 2024-05-18
top: 1
categories: code
tags:
  - c#
  - code
---

## SAP DLL

[网盘下载：https://pan.baidu.com/s/1S6yEodJn_9tnjjO1I9_-hg?pwd=bx7f](https://pan.baidu.com/s/1S6yEodJn_9tnjjO1I9_-hg?pwd=bx7f)

## 配置SAP连接参数

```csharp

public class DestinationConfig : IDestinationConfiguration
{

    private static string AppServerHost = ConfigurationManager.AppSettings["AppServerHost"];
    private static string SystemNumber = ConfigurationManager.AppSettings["SystemNumber"];
    private static string User = ConfigurationManager.AppSettings["User"];
    private static string Password = ConfigurationManager.AppSettings["Password"];
    private static string Client = ConfigurationManager.AppSettings["Client"];
    private static string Language = ConfigurationManager.AppSettings["Language"];

    public RfcConfigParameters GetParameters(string destinationName)
    {
        RfcConfigParameters configParams = new RfcConfigParameters();

        // 设置SAP连接参数
        configParams.Add(RfcConfigParameters.AppServerHost, AppServerHost);
        configParams.Add(RfcConfigParameters.SystemNumber, SystemNumber);
        configParams.Add(RfcConfigParameters.User, User);
        configParams.Add(RfcConfigParameters.Password, Password);
        configParams.Add(RfcConfigParameters.Client, Client);
        configParams.Add(RfcConfigParameters.Language, Language);

        return configParams;
    }

    public bool ChangeEventsSupported()
    {
        return false;
    }

    public event RfcDestinationManager.ConfigurationChangeHandler ConfigurationChanged;
}

```

## 调用SAP接口

```csharp

public class SAPService
{
    var dc = new DestinationConfig();
    RfcDestination destination = null;
    try
    {
        RfcDestinationManager.RegisterDestinationConfiguration(dc);

        destination = RfcDestinationManager.GetDestination("DestinationConfig");

        destination.Ping();

        IRfcFunction rfcFunction = destination.Repository.CreateFunction("your_function");

        //rfcFunction.SetValue("PARAMETER_NAME", "PARAMETER_VALUE");

        rfcFunction.Invoke(destination);

        IRfcTable Ex_Data = rfcFunction.GetTable("Ex_Data"); //返回数据表
        IRfcTable EX_return = rfcFunction.GetTable("EX_return"); //返回状态表

        //处理返回的数据
        DataTable dataTable = new DataTable();
        dataTable.Columns.Add("column1");
        dataTable.Columns.Add("column2");

        dataTable.Columns.Add("FLAG");
        dataTable.Columns.Add("MSG");
        dataTable.Columns.Add("CODE"); dataTable.Columns.Add("CreateDate");

        foreach (IRfcStructure row in Ex_Data)
        {
            DataRow dataRow = dataTable.NewRow();
            foreach (DataColumn column in dataTable.Columns)
            {
                string columnName = column.ColumnName;
                if (columnName.Contains("FLAG") || columnName.Contains("MSG") || columnName.Contains("CODE"))
                    break;
                if (row.GetString(columnName) != null)
                    dataRow[columnName] = row.GetString(columnName);
            }
            dataRow["FLAG"] = EX_return[0].GetString("FLAG");
            dataRow["MSG"] = EX_return[0].GetString("MSG");
            dataRow["CODE"] = EX_return[0].GetString("CODE"); dataRow["CreateDate"] = DateTime.Now;
            dataTable.Rows.Add(dataRow);
        }


        resTable.Columns.Add("FLAG");
        resTable.Columns.Add("MSG");
        resTable.Columns.Add("CODE");
        foreach (IRfcStructure row in EX_return)
        {
            DataRow dataRow = resTable.NewRow();
            foreach (DataColumn column in resTable.Columns)
            {
                string columnName = column.ColumnName;
                if (row.GetString(columnName) != null)
                {
                    dataRow[columnName] = row.GetString(columnName);
                }
            }
            resTable.Rows.Add(dataRow);
        }

    }
    catch (Exception ex)
    {
       //to do
    }
    finally
    {
        if (destination != null)
        {
            RfcDestinationManager.UnregisterDestinationConfiguration(dc);
        }
    }
}

```
