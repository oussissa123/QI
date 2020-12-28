package com.limos.fr.mod;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.limos.fr.exceptions.DataLoadingError;

@RestController
public class ConfigLoading {

	//consumes = MediaType.TEXT_PLAIN_VALUE, produces = MediaType.APPLICATION_JSON_VALUE,
	@RequestMapping(method = RequestMethod.POST, value = "/load/database")
	public String load(@RequestBody String conf) {
//		String res = "{'loaded':'1'}";
		try {
			JSONObject resValue = new JSONObject(conf);
			Config.passWord = resValue.getString("passWord");
			Config.userName = resValue.getString("userName");
			Config.port = resValue.getString("port");
			Config.host = resValue.getString("host");
			Config.type = resValue.getString("type");
			Config.databaseName = resValue.getString("databaseName");
			Config.load();
			System.out.println("Preprocessed Database Loaded");	
			return "{'loaded':'1'}";
		}catch(Exception e) {
//			return "{'loaded':'0'}";
			e.printStackTrace();
			throw new DataLoadingError();
		}
	}
}
