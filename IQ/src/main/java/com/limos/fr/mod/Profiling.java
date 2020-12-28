package com.limos.fr.mod;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.limos.fr.exceptions.DataLoadingError;
import com.limos.fr.queries.ProfilingService;

@RestController
public class Profiling {

	@Autowired
	private ProfilingService service;
	
	@RequestMapping(value = "/percentVio", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String getPercentVioAndNoVio() {
		try {
			return service.getVioAndNoVio();
		} catch (Exception e) {
			throw new DataLoadingError();
		}
	}

	@RequestMapping(value = "/distributionviolations", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String getdistributionViolation() {
		try {
			return service.distributionViolation();
		} catch (Exception e) {
			throw new DataLoadingError();
		}
	}

	@RequestMapping(value = "/distributionviolationssubset", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String distributionviolationssubset() {
		try {
			return service.distributionviolationssubset();
		} catch (Exception e) {
			throw new DataLoadingError();
		}
	}            
         
	@RequestMapping(value = "/distributionviolationsbyconstraint", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String distributionviolationsbyconstraint() {
		try {
			return service.distributionviolationsbyconstraint(); 
		} catch (Exception e) {
			throw new DataLoadingError();
		}
	}
	
	@RequestMapping(value = "/getConstraints", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String getConstraints() {
		try {
			return service.getConstraints();
		} catch (Exception e) {
			throw new DataLoadingError();
		}		
	}

	//----------------------------------------------------------------------------------------------------------------------------------
	
	@RequestMapping(value = "/consider/percentVio", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String getPercentVioAndNoVio(@RequestParam(name = "considered") long considered) {
		try {
			String res = service.getVioAndNoVio(considered);
//			System.out.println(res);
			return res;
		} catch (Exception e) {
			System.out.println("error");
			throw new DataLoadingError();
		}
	}
	
	@RequestMapping(value = "/consider/distributionviolations", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String getdistributionViolation(@RequestParam(name = "considered") long considered) {
		try {
			return service.distributionViolation(considered);
		} catch (Exception e) {
			throw new DataLoadingError();
		}
	}
	
	@RequestMapping(value = "/consider/distributionviolationssubset", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String distributionviolationssubset(@RequestParam(name = "considered") long considered) {
		try {
			return service.distributionviolationssubset(considered);
		} catch (Exception e) {
			throw new DataLoadingError();
		} 
	}

	@RequestMapping(value = "/consider/distributionviolationsbyconstraint", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE})
	public String distributionviolationsbyconstraint(@RequestParam(name = "considered") long considered) {
		try {
			String res = service.distributionviolationsbyconstraint(considered);
//			System.out.println(res);
			return res;
		} catch (Exception e) {
			throw new DataLoadingError();
		}
	}
	
	
	@RequestMapping(value = "/exploration/by/constraints", method = RequestMethod.POST)
	public String exploration_by_constraints(@RequestBody String param) {
		try { 
			 
//			System.out.println(param);
			String res = service.explorationByConstraints(param);
//			System.out.println("---------------------------------------------- \n\n" + res +" \n\n -------------------------");
			
			return res;
		}catch(Exception e) {e.printStackTrace(); throw new DataLoadingError();}
	}
   
	
	@RequestMapping(value = "/constraints/correlation", method = RequestMethod.POST)
	public String constraints_correlation(@RequestBody String param) {
		try {
//			System.out.println(param);
			String res = service.getConstraintsCorrelation(param);
//			System.out.println(res);
			
			return res;
		}catch(Exception e) {e.printStackTrace(); throw new DataLoadingError();}
	}
	
	@RequestMapping(value = "/exploration/tuple/proportion/", method = RequestMethod.POST)
	public String tuple_proportion(@RequestBody String param) {
		try {
//			System.out.println(param);
			String res = service.gettupleProportion(param);
//			System.out.println(res);
			
			return res;
		}catch(Exception e) {e.printStackTrace(); throw new DataLoadingError();}
	}	  
	 
	@RequestMapping(value = "/exploration/tuple/violations/", method = RequestMethod.POST)
	public String tuple_violations(@RequestBody String param) {
		try {
//			System.out.println(param);
			String res = service.gettupleViolations(param);
//			System.out.println(res);
			return res; 
		}catch(Exception e) {e.printStackTrace(); throw new DataLoadingError();}
	}	   
	  
}
