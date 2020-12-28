package com.limos.fr.queries;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import com.limos.fr.mod.Config;


@Component
public class ProfilingImp implements ProfilingService{

	public String getVioAndNoVio() throws Exception{
		return byVio(-1);
	}

	public String getVioAndNoVio(long l) throws Exception{
		return byVio(l);
	}

	public String byVio(long considered) throws Exception{
		List<String> tables = Config.getTables();
		double vio = 0d;
		double novio = 0d;
		for(String tab:tables) {
			ResultSet s1 = null;
			ResultSet s2 = null;
			if (considered>=0) {
				s1 = Config.con.createStatement().executeQuery("SELECT count(*) FROM "+tab+" WHERE vioset = 0");
				s2 = Config.con.createStatement().executeQuery("SELECT count(*), vioset FROM "+tab+" WHERE vioset <> 0 GROUP BY vioset");
				s1.next();
				novio += s1.getInt(1);
				while(s2.next()){
					if ( (s2.getLong(2) & considered) == 0)
						novio += s2.getInt(1);
					else
						vio += s2.getInt(1);
				}
			}else {
				s1 = Config.con.createStatement().executeQuery("SELECT count(*) FROM "+tab+" WHERE vioset <> 0");
				s2 = Config.con.createStatement().executeQuery("SELECT count(*) FROM "+tab+" WHERE vioset = 0");
				s1.next();s2.next();
				vio += s1.getInt(1);
				novio += s2.getInt(1);
			}
			
			s1.close();
			s2.close();
		}
		double all = vio+novio;
		vio = (vio/all)*100;
		novio = (novio/all)*100;
		
//		System.out.println("::::::::::::::::::::::::::::::: "+vio);
		
		return "{\"novio\":"+novio+", \"vio\":"+vio+"}";

	}
	
	public String distributionViolation() throws Exception {
		return byViolation(-1);
	}

	public String distributionViolation(long l) throws Exception {
		return byViolation(l);
	}
	
	public String byViolation(long considered) throws Exception{
		String res = "";
		List<String> tables = Config.getTables();
		Map<Integer, Integer> maps = new HashMap<Integer, Integer>();	
		for(String tab:tables) {
			ResultSet s1 = Config.con.createStatement().executeQuery("SELECT vioset, count(*) FROM "+tab+" GROUP BY vioset");
			while(s1.next()) {
				long vioset = s1.getLong(1);
				if (considered>=0)
					vioset = vioset & considered;
				int count = s1.getInt(2);
				int key = Long.bitCount(vioset);
				if (!maps.containsKey(key))
					maps.put(key, 0);
				maps.put(key, count+maps.get(key));
			}
			s1.close();
		}
		int all = 0;
		for(int key:maps.keySet())
			all += maps.get(key);
		List<Integer> X = new ArrayList<Integer>();
		List<Double> Y = new ArrayList<Double>();
		for(int key:maps.keySet()) {
			//res+="\""+key+"\":"+(maps.get(key)/all)+", ";
			if (key!=0) {
				X.add(key);
				Y.add(((maps.get(key)*1d)/(all*1d))*100);
			}
		}
		res = "{\"Violations\":"+X.toString()+", \"percent\":"+Y.toString()+"}";
		return res;
	}
	
	public String distributionviolationssubset() throws Exception {		
		return bySubset(-1);
	}
	
	public String distributionviolationssubset(long l) throws Exception {		
		return bySubset(l);
	}
	
	public String bySubset(long considered) throws Exception{
		double all = 0;
		List<String> tables = Config.getTables();		
		Map<Long, Double> tempRes = new HashMap<Long, Double>();
		for(String tab:tables) {
			String query = "SELECT vioset, count(*) FROM "+tab+" GROUP BY vioset";
			ResultSet r = Config.con.createStatement().executeQuery(query);
			while(r.next()) {
				long vioset = r.getLong(1);
				if (considered>=0)
					vioset = vioset & considered;
				int count = r.getInt(2);
				if (!tempRes.containsKey(vioset))
					tempRes.put(vioset, 0d);
				tempRes.put(vioset, count+tempRes.get(vioset));
				all += count;
			}
			r.close();
		}
		List<String> positions = new ArrayList<String>();
		List<Double> counts = new ArrayList<Double>();
		Map<Integer, String> maps = new HashMap<Integer, String>();
		
		String query = "SELECT * FROM c.c;";
		ResultSet r = Config.con.createStatement().executeQuery(query);
		while(r.next())
			maps.put(r.getInt("position"), r.getString("id"));	
		r.close();
		
		for(long l:tempRes.keySet()) {
			String val = "{";
			long t = l;
			int pos = 0;
			while(t!=0) {
				if (t%2==1)
					val += maps.get(pos)+", ";
				t = t/2;
				pos++;
			}
			if (val.length()>1)
				val = val.substring(0,  val.length()-2);
			val = val+"}";
			if (!val.equals("{}")) {
				positions.add("\""+val+"\"");
				counts.add((tempRes.get(l)/all)*100);
			}
		}
		return "{\"position\":"+positions.toString()+", \"count\":"+counts.toString()+"}";
	}
	  

	public String distributionviolationsbyconstraint() throws Exception {
		return byConstraints(-1);
	}
	
	public String distributionviolationsbyconstraint(long l) throws Exception {
		return byConstraints(l);
	}
	
	public String byConstraints(long considered) throws Exception{
		//String res = "";
		double all = 0;
		List<String> tables = Config.getTables();		
		Map<Integer, Double> tempRes = new HashMap<Integer, Double>();
		for(String tab:tables) {
			String query = "SELECT vioset, count(*) FROM "+tab+"  GROUP BY vioset";
			ResultSet r = Config.con.createStatement().executeQuery(query);
			while(r.next()) {
				long vioset = r.getLong(1);
				if (considered>=0)
					vioset = vioset & considered;
				List<Integer> positions = new ArrayList<Integer>();
				int i =0;
				while(vioset!=0) {
					long poss = vioset%2;
					if (poss==1)
						positions.add(i);
					vioset = vioset / 2;
					i++;
				}				
				int count = r.getInt(2);
				for(int pos:positions){
					if (!tempRes.containsKey(pos))
						tempRes.put(pos, 0d);
					tempRes.put(pos, count+tempRes.get(pos));
				}
				all += count; 
			}
			r.close();
		}
		List<String> positions = new ArrayList<String>();
		List<Double> counts = new ArrayList<Double>();
		
		String query = "SELECT * FROM c.c;";
		ResultSet r = Config.con.createStatement().executeQuery(query);
		while(r.next()) {
			int pos = r.getInt("position");
			if (tempRes.containsKey(pos)) {
				positions.add("\""+r.getString("id")+"\"");
				counts.add((tempRes.get(pos)/all)*100);
			}
		}
		r.close();
		return "{\"position\":"+positions.toString()+", \"count\":"+counts.toString()+"}";
	}
	

	public String getConstraints() throws Exception {
		String query = "SELECT * FROM c.c;";
		ResultSet r = Config.con.createStatement().executeQuery(query);
		String res = "[";
		while(r.next())
			res+="{\"position\":"+r.getInt("position")+", \"id\":\""+r.getString("id")+"\", \"description\":\""+r.getString("description")+"\"}, ";
		if (res.length()>1)
			res = res.substring(0, res.length()-2);
		r.close();
		return res+"]";
	}

	public String explorationByConstraints(String param) throws Exception {
		String res = "";
		//'{"from":"'+from+'", "where":"'+where+'", "limit":"'+limit+'", "select":'+select+', "group":'+group+', "count":'+count+'}'};
		JSONObject jo =  new JSONObject(param);
		String from = jo.getString("from");
		String where = jo.getString("where");
		String limit = jo.getString("limit");
		
		JSONArray group = jo.getJSONArray("group");
		JSONArray select = jo.getJSONArray("select");
		JSONArray count = jo.getJSONArray("count");
		
		List<String> groups = new ArrayList<String>();
		List<String> selects = new ArrayList<String>();
		List<String> counts = new ArrayList<String>();
		
		for(int i=0; i<group.length(); i++)
			groups.add(group.getString(i));
		for(int i=0; i<select.length(); i++)
			selects.add(select.getString(i));
		for(int i=0; i<count.length(); i++)
			counts.add(count.getString(i));
		
		String query = "SELECT DISTINCT "+selects.toString().replace("[", "").replace("]", "").replace("\"", "")+" FROM "+from+" WHERE "+where.replace(",", " AND ");
		try {
			int sparse = Integer.parseInt(limit.replace(" ", ""));
			if (sparse>0)
				query += " LIMIT "+limit;
		}catch(Exception e) {e.printStackTrace();}

		System.out.println(query);
		ResultSet rs = Config.con.createStatement().executeQuery(query);
		
		List<String> labels = new ArrayList<String>();
		List<String> datasets = new ArrayList<String>();
		Color col = new Color(40, 100, 0);
		
		while(rs.next()) {
			String tup = "";
			String reqwhere = "";
			for(String s:selects) {
				String tempS = s;
				if (s.split("\\.").length>=2)
					tempS = s.split("\\.")[1];
				
				tup += tup+s+"="+rs.getString(tempS)+", ";
				reqwhere += s+"='"+rs.getString(tempS)+"' AND ";
			}
			tup = "<"+tup.substring(0, tup.length()-2)+">";
			labels.add("\""+tup+"\"");
			reqwhere = reqwhere.substring(0, reqwhere.length()-5);
			String gs = groups.toString().replace("[", "").toString().replace("]", "").toString().replace("\"", "");
			String cs = counts.toString().replace("[", "").toString().replace("]", "").toString().replace("\"", "");
			String req = "SELECT "+gs+", COUNT(DISTINCT("+cs+")) as count__ FROM "+from+" WHERE "+ where.replace(",", " AND ")+" AND " + reqwhere+ " GROUP BY "+gs;
			
			ResultSet rse = Config.con.createStatement().executeQuery(req);
			while(rse.next()) {
				String label = "";
				for(String g:groups) {
					String tempG = g;
					if (g.split("\\.").length>=2)
						tempG = g.split("\\.")[1];
					label += label+g+":"+rse.getString(tempG)+", ";
				}
				label = "\""+label.substring(0, label.length()-1)+"\"";
				List<Integer> data = getZero(labels.size());
				data.set(data.size()-1, rse.getInt("count__"));
				datasets.add("{\"label\":"+label+", \"data\":"+data.toString()+", \"backgroundColor\":\""+getNextColor(col)+"\"}");
			}			
			rse.close();
		}
		
		System.out.println("end ...");
		
		rs.close();
		
		res = "{\"labels\":"+labels.toString()+", \"datasets\":"+datasets.toString()+"}";
		
		return res;
	}

	private String getNextColor(Color c) {
		String col = "rgb("+c.red+", "+c.blue+", "+c.green+")";
		c.red=(c.red+10)%255;
		c.blue=(c.blue+20)%255;
		c.green=(c.green+30)%255;
		return col;
	}

	private List<Integer> getZero(int n) {
		List<Integer> getZero = new ArrayList<Integer>();
		for(int i=0; i<n;i++)
			getZero.add(0);
		return getZero;
	}
	
	class Color {
		int red, green, blue;

		public Color(int red, int green, int blue) {
			super();
			this.red = red;
			this.green = green;
			this.blue = blue;
		}
		
	}

	public String getConstraintsCorrelation(String param) throws Exception {
		JSONObject jo =  new JSONObject(param);
		
		String pos = jo.getString("Constraint_Position");
		int position = -1;
		
		String query = "SELECT * FROM c.c;";
		ResultSet r = Config.con.createStatement().executeQuery(query);
		Map<Integer, String> cst = new HashMap<Integer, String>();
		while(r.next()) {
			cst.put(r.getInt("position"), r.getString("id"));
			if (pos.equalsIgnoreCase(r.getString("id")))
				position = r.getInt("position");
		}
		r.close();

		long ll =puissance(2, position);

		int count = 0;
		Map<Integer, Integer> reps = new HashMap<Integer, Integer>();
		List<String> tables = Config.getTables();
		for(String tab:tables) {
			ResultSet s1 = Config.con.createStatement().executeQuery("SELECT vioset FROM "+tab);
			while(s1.next()) {
				if ((s1.getLong(1)&ll) != 0) {
					count++;
					long vioset = s1.getLong(1);
					int i =0;
					while(vioset!=0) {
						long poss = vioset%2;
						if (poss==1) {
							
							if (position!=i){
								if (!reps.containsKey(i))
									reps.put(i, 0);
								reps.put(i, reps.get(i)+1);
							}
						}
						vioset = vioset / 2;
						i++;
					}
				}
			}
			s1.close();
		}

		List<String> ids = new ArrayList<String>();
		List<Double> cs = new ArrayList<Double>();
		for(Integer i:reps.keySet()) {
			ids.add("\""+cst.get(i)+"\"");
			cs.add(((reps.get(i)*1d)/(count*1d))*100);
		}		
		return "{\"id\":"+ids.toString()+", \"count\":"+cs.toString()+"}";
	}
 
	private long puissance(int i, int position) {
		long res = 1;
		for(int j=0; j<position; j++)
			res *= i;      
		return res;                     
	}

	public String gettupleProportion(String param) throws Exception {
		JSONObject jo =  new JSONObject(param);
		long pos = jo.getLong("constraints");
		String rel = "SELECT tups, constr FROM vio.violations WHERE pos & "+pos+"<>0";
		
		Map<String, Integer> props = new HashMap<String, Integer>();
		Map<String, Set<String>> constr = new HashMap<String, Set<String>>();
		int all = 0;
		ResultSet rs = Config.con.createStatement().executeQuery(rel);
		while(rs.next()) {
			String [] tups = rs.getString("tups").split("( )*,( )*");
			String c = rs.getString("constr");
			for(String tup:tups) {
				if (!props.containsKey(tup)) {
					props.put(tup, 0);
					constr.put(tup, new HashSet<String>());
				}
				props.put(tup, props.get(tup)+1);
				constr.get(tup).add(c);
			}
			all++; 
		}
		rs.close();
		
		List<String> X = new ArrayList<String>();
		List<Double> Y = new ArrayList<Double>();
		  
		for(String key:props.keySet()) {  
			X.add("\""+key+"::"+constr.get(key).toString()+"\"");
			Y.add((all==0)?0:( (props.get(key)*1d)/(all*1d))*100 );
		}
		return "{\"X\":"+X+", \"Y\":"+Y+"}";  
	} 
 
	public String gettupleViolations(String param) throws Exception {
		JSONObject jo =  new JSONObject(param);
		long pos = jo.getLong("constraints"); 
		String rel = "SELECT tups, constr FROM vio.violations WHERE pos & "+pos+"<>0";
		
		
		List<String> res = new ArrayList<String>();
		
		ResultSet rs = Config.con.createStatement().executeQuery(rel);
		while(rs.next()) {
			String tups = rs.getString("tups");
			String c = rs.getString("constr");
			res.add("{\"tups\":\""+tups+"\", \"cons\":\""+c+"\"}");
		} 
		rs.close();   
		return res.toString();    
	}              
}   
