package ar.com.genomasoft.fenix.reports;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

@Component
public class PdfGeneratorUtil {

    private static final Logger LOGGER = LoggerFactory.getLogger(PdfGeneratorUtil.class);

	@Autowired
	private TemplateEngine templateEngine;
	
	public byte[] createPdf(String templateName, Map<Object, Object> map) throws Exception {
		Assert.notNull(templateName, "The templateName can not be null");
		Context ctx = new Context();
		if (map != null) {
		     Iterator<Map.Entry<Object, Object>> itMap = map.entrySet().iterator();
		       while (itMap.hasNext()) {
			  Map.Entry<Object, Object> pair = (Map.Entry<Object, Object>) itMap.next();
		          ctx.setVariable(pair.getKey().toString(), pair.getValue());
			}
		}
		
		String processedHtml = templateEngine.process(templateName, ctx);
		  FileOutputStream os = null;
		  String fileName = UUID.randomUUID().toString();
	        try {
	            final File outputFile = File.createTempFile(fileName, ".pdf");
	            os = new FileOutputStream(outputFile);

	            ITextRenderer renderer = new ITextRenderer();
	            renderer.setDocumentFromString(processedHtml);
	            renderer.layout();
	            renderer.createPDF(os, false);
	            renderer.finishPDF();
	            System.out.println("PDF created successfully");
	            return Files.readAllBytes(outputFile.toPath());
	        }
	        finally {
	            if (os != null) {
	                try {
	                    os.close();
	                } catch (IOException e) { /*ignore*/
	                	LOGGER.error("PdfGeneratorUtil", e);
	                }
	            }
	        }
	}
}