package com.limos.fr.mod;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Config {
	
	public static String passWord = "65515525";
	public static String userName = "postgres";
	
	public static String port = "5432";
	public static String host = "localhost";
	public static String type = "postgresql";
	public static String databaseName = "foodinspection";

	
	public static Connection con = null;
	
	
	public static String getUrl() {
		return "jdbc:"+type+"://"+host+":"+port+"/"+databaseName+"?user="+userName+"&password="+passWord;
	}
	
	
	public static Connection getCon() throws SQLException {
		return DriverManager.getConnection(getUrl());
	}
	
	public static void load() throws SQLException {
		con = getCon();
	}
	

	public static List<String> getTables() throws SQLException {
		List<String> getTables = new ArrayList<String>();
		String query = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'";
		ResultSet res = con.createStatement().executeQuery(query);
		while(res.next()) 
			getTables.add(res.getString(1));
		return getTables;
	}
	
}
