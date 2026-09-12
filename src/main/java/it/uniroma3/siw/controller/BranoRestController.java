package it.uniroma3.siw.controller;

import java.time.Year;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.uniroma3.siw.model.Album;
import it.uniroma3.siw.model.Brano;
import it.uniroma3.siw.service.BranoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/brani")
@CrossOrigin(origins = "http://localhost:5173")
public class BranoRestController {
	@Autowired
	private BranoService branoService;

	@GetMapping
	public ResponseEntity<List<Brano>> getAllBrani() {
		List<Brano> brani = this.branoService.findAll();
		return ResponseEntity.ok(brani);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Brano> getBranoById(@PathVariable Long id) {
		Brano brano = this.branoService.findById(id);

		if (brano != null) {
			return ResponseEntity.ok(brano);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	
	@PostMapping
	public ResponseEntity<Void> inserisciNuovoBrano(@Valid @RequestBody Brano brano) {
		if (brano.getAnno() > 0) {
			int annoAttuale = Year.now().getValue();
			if (brano.getAnno() > annoAttuale) {
				return ResponseEntity.badRequest().build();
			}
		}

		this.branoService.save(brano);
		return ResponseEntity.ok().build();
	}
	
	@PutMapping("/{id}")
    public ResponseEntity<Void> modificaBrano(@PathVariable Long id, @Valid @RequestBody Brano datiAggiornati) {
        Brano branoEsistente = this.branoService.findById(id);
        if (branoEsistente == null) return ResponseEntity.notFound().build();

        if (datiAggiornati.getAnno() > 0 && datiAggiornati.getAnno() > Year.now().getValue()) {
            return ResponseEntity.badRequest().build();
        }

        branoEsistente.setNome(datiAggiornati.getNome());
        branoEsistente.setAnno(datiAggiornati.getAnno());
        branoEsistente.setGenere(datiAggiornati.getGenere());
        branoEsistente.setMinuti(datiAggiornati.getMinuti());
        branoEsistente.setSecondi(datiAggiornati.getSecondi());
        branoEsistente.setImgUrl(datiAggiornati.getImgUrl());
        branoEsistente.setAutore(datiAggiornati.getAutore());
        branoEsistente.setAlbum(datiAggiornati.getAlbum());
        branoEsistente.setFeaturing(datiAggiornati.getFeaturing()); // IMPORTANTISSIMO!

        this.branoService.save(branoEsistente);
        return ResponseEntity.ok().build();
    }
	
	@DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminaBrano(@PathVariable Long id) {
        Brano branoEsistente = this.branoService.findById(id);
        if (branoEsistente == null) {
            return ResponseEntity.notFound().build(); 
        }

        this.branoService.delete(branoEsistente);
        return ResponseEntity.ok().build(); 
    }
}