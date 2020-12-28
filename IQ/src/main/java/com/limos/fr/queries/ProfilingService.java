package com.limos.fr.queries;

public interface ProfilingService {
	public String getVioAndNoVio() throws Exception;
	public String distributionViolation() throws Exception;
	public String distributionviolationssubset() throws Exception;
	public String distributionviolationsbyconstraint() throws Exception;
	
	public String getVioAndNoVio(long l) throws Exception;
	public String distributionViolation(long l) throws Exception;
	public String distributionviolationssubset(long l) throws Exception;
	public String distributionviolationsbyconstraint(long l) throws Exception;
	
	public String explorationByConstraints(String param) throws Exception;
	
	public String getConstraintsCorrelation(String param) throws Exception;
	
	
	public String getConstraints() throws Exception;
	public String gettupleProportion(String param) throws Exception;
	public String gettupleViolations(String param) throws Exception;
		
}
